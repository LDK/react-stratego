#!/usr/bin/env python
 
from os import curdir, rename
from os.path import join as pjoin
from cgi import parse_header, parse_multipart
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
sqlite_file = './stratego.sqlite'
import json
import simplejson
import sqlite3
import random
import string

# HTTPRequestHandler class
class HTTPServer_RequestHandler(BaseHTTPRequestHandler):
  def randomString(self,stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))
  def parse_POST(self):
    ctype, pdict = parse_header(self.headers.get('Content-Type'))
    pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
    content_len = int(self.headers.get('Content-length'))
    pdict['CONTENT-LENGTH'] = content_len
    if ctype == 'multipart/form-data':
        postvars = parse_multipart(self.rfile, pdict)
    elif ctype == 'application/x-www-form-urlencoded':
        length = int(self.headers['content-length'])
        postvars = parse_qs(
        self.rfile.read(length), 
        keep_blank_values=1)
    else:
        postvars = {}
    return postvars
  # GET
  def do_GET(self):
    # Send response status code
    self.send_response(200)
 
    # Send headers
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Content-type','text/html')
    self.end_headers()
 
    # Send message back to client
    message = "Hello world!"
    # Write content as utf-8 data
    self.wfile.write(bytes(message, "utf8"))
    return

  def respond(self, value):
    self.send_response(value)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()

  def saveSampleImage(self, data):
    fName = data['sample']['wav']
    fLoc = pjoin(curdir, "audio", fName)
    imgLoc = pjoin(curdir, "img/waveform", fName.replace('.wav','.png'))
    waveImg = waveform.Waveform(fLoc)
    imgInitLoc = waveImg.save()
    rename(imgInitLoc,imgLoc)
    return imgLoc

  def saveSongData(self, data):
    # TODO: Repurpose as saveGameData
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    if ('id' in data and data['id']):
        updateSql = "UPDATE `song` SET title='{title}',user_id='{uid}',bpm='{bpm}',swing='{swing}' WHERE id = '{id}'".\
            format(title=data['title'], uid=data['user_id'], bpm=data['bpm'], swing=data['swing'], id=data['id'])
        c.execute(updateSql)
        savedId = data['id']
    else:
        insertSql = "REPLACE INTO `song` (title,user_id,bpm,swing) VALUES ('{title}','{uid}','{bpm}','{swing}')".\
            format(title=data['title'], uid=data['user_id'], bpm=data['bpm'], swing=data['swing'])
        c.execute(insertSql)
        savedId = c.lastrowid
    conn.commit()
    conn.close()
    return savedId

  def getSongData(self, id):
    # TODO: Repurpose as getGameData
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT title, user_id, bpm, swing FROM `song` WHERE id = '{id}'".format(id=id)
    c.execute(selectSql)
    songData = c.fetchone()
    postRes = {}
    postRes['title'] = songData[0]
    postRes['user_id'] = songData[1]
    postRes['bpm'] = songData[2]
    postRes['swing'] = songData[3]
    conn.commit()
    conn.close()
    return postRes

  def getSongList(self, uid):
    # TODO: Repurpose as getGameList
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT title, id, bpm, swing FROM `song` WHERE user_id = '{uid}'".format(uid=uid)
    print("select sql",selectSql)
    c.execute(selectSql)
    songs = c.fetchall()
    conn.close()
    postRes = {}
    for song in songs:
        if not (song[1] in postRes):
            postRes[song[1]] = {}
        postRes[song[1]]['title'] = song[0]
        postRes[song[1]]['id'] = song[1]
        postRes[song[1]]['bpm'] = song[2]
        postRes[song[1]]['swing'] = song[3]
    return postRes

  def checkCreds(self,user_id,userKey):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    c.execute("SELECT id FROM `user` WHERE `id` = '{uid}' AND `userKey` = '{userKey}'".\
        format(uid=user_id, userKey=userKey))
    user_match = c.fetchone()
    conn.close()
    return user_match

  def do_POST(self):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    
    if (self.path == '/login'):
        postvars = self.parse_POST()
        uName = postvars['username'][0]
        uPass = postvars['password'][0]
        c.execute("SELECT id, userKey FROM `user` WHERE `username` = '{username}' AND `password` = '{password}'".\
            format(username=uName, password=uPass))
        user_match = c.fetchone()
        if not user_match:
            self.respond(401)
            c.execute("SELECT id FROM `user` WHERE `username` = '{username}'".format(username=uName))
            username_found = c.fetchone()
            if username_found:
                postRes = {
                    "error": 'wrong-password'
                }
            else:
                postRes = {
                    "error": 'no-user'
                }
        else:
            self.respond(200)
            postRes = {}
            postRes['user_id'] = user_match[0]
            postRes['userKey'] = user_match[1]
            postRes['username'] = uName
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/register'):
        postvars = self.parse_POST()
        uName = postvars['username'][0]
        uPass = postvars['password'][0]
        uEmail = postvars['email'][0]
        c.execute("SELECT id, userKey FROM `user` WHERE `username` = '{username}'".format(username=uName))
        user_match = c.fetchone()
        if user_match:
            self.respond(401)
            postRes = {
                "error": 'username-taken'
            }
        else:
            c.execute("SELECT id, userKey FROM `user` WHERE `email` = '{email}'".format(email=uEmail))
            email_match = c.fetchone()
            if email_match:
                self.respond(401)
                postRes = {
                    "error": 'email-taken'
                }
            else:
                uKey = self.randomString(32)
                insertSql = "INSERT INTO `user` (username,email,password,userKey) VALUES ('{un}','{em}','{pw}','{pk}')"\
                .format(un=uName, em=uEmail, pw=uPass, pk=uKey)
                c.execute(insertSql)
                conn.commit()
                self.respond(200)
                postRes = {
                    "username" : uName,
                    "email" : uEmail,
                    "userKey" : uKey
                }
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/upload'):
        postvars = self.parse_POST()
        fName = postvars['filename'][0]
        fData = postvars['file'][0]
        fLoc = pjoin(curdir, "audio/uploaded", fName)
        with open(fLoc, 'wb') as fh:
            fh.write(fData)
        imgLoc = pjoin(curdir, "img/waveform/uploaded", fName.replace('.wav','.png'))
        waveImg = waveform.Waveform(fLoc)
        imgInitLoc = waveImg.save()
        rename(imgInitLoc,imgLoc)
        self.respond(200)
        postRes = {
          "wav": fName,
          "img": imgLoc
        }
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/song'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        sid = postvars['song_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getSongData(sid)
        postRes['id'] = sid
        postRes['channels'] = self.getSongChannels(sid)
        postRes['patterns'] = self.getSongPatterns(sid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/songs'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getSongList(uid)
        # postRes['id'] = sid
        # postRes['channels'] = self.getSongChannels(sid)
        # postRes['patterns'] = self.getSongPatterns(sid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/channels'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        sid = postvars['song_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getSongChannels(sid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/patterns'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        sid = postvars['song_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getSongPatterns(sid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/upload-splitter'):
        postvars = self.parse_POST()
        fName = postvars['filename'][0]
        fData = postvars['file'][0]
        fLoc = pjoin(curdir, "audio/uploaded", fName)
        with open(fLoc, 'wb') as fh:
            fh.write(fData)
        imgLoc = pjoin(curdir, "img/waveform/uploaded", fName.replace('.wav','.png'))
        waveImg = waveform.Waveform(fLoc)
        imgInitLoc = waveImg.save()
        rename(imgInitLoc,imgLoc)
        self.respond(200)
        postRes = {
          "wav": fName,
          "img": imgLoc,
          "slices": groove.split(fName,16)
        }
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/render'):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        fName = groove.renderJSON(self.data_string);
        self.wfile.write(bytes(fName, "utf8"))
    else:
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        data = simplejson.loads(self.data_string)
        postRes = {}
        userKey = data['currentUser']['userKey']
        # TODO HERE: checkUserKey(userKey,data['currentUser']['user_id']) ... if fail, return
        if ('id' in data and data['id']):
            songId = data['id']
            self.saveSongData({
                "user_id": data['currentUser']['user_id'],
                "title": data['title'],
                "bpm": int(data['bpm']),
                "swing": data['swing'],
                "id": songId
            })
        else:
            songId = self.saveSongData({
                "user_id": data['currentUser']['user_id'],
                "title": data['title'],
                "bpm": int(data['bpm']),
                "swing": data['swing']
            })
        postRes['id'] = songId
        trackPos=0
        for key, track in data['tracks'].items():
            if not ('image' in track):
                track['image'] = self.saveSampleImage(track)
            sampleId = self.saveSample({
                "filename": track['sample']['wav'],
                "reverse": track['reverse'],
                "normalize": track['normalize'],
                "trim": track['trim'],
                "image": track['image']
            })
            trackPos = trackPos + 1
            track['sample_id'] = sampleId
            track['song_id'] = songId
            track['name'] = key
            track['position'] = trackPos
            channelId = self.saveSongChannel(track)
            track['channel_id'] = channelId
            filterSectionId = self.saveFilterSection(1,channelId,track['filter'])
            filterSection2Id = self.saveFilterSection(2,channelId,track['filter2'])
            track['filter_id'] = filterSectionId
            track['filter2_id'] = filterSection2Id
        # NOTE: We don't have multiple patterns yet so this will get a little more complex
        for key, pattern in data['patterns'].items():
            patternId = pattern['id']
            if (patternId):
                self.savePattern({
                    "id": pattern['id'],
                    "bars": pattern['bars'],
                    "song_id": songId,
                    "position": pattern['position'],
                    "name": pattern['name']
                })    
            else:
                position = key
                patternId = self.savePattern({
                    "bars": data['bars'],
                    "song_id": songId,
                    "position": position,
                    "name": data['title'] + " Pattern  " + str(position)
                })    
        for key, track in data['tracks'].items():
            self.saveStepSequence({
                "pattern_id": patternId,
                "channel_id": track['channel_id'],
                "steps": track['notes']
            })
        self.respond(200)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
    return

def run():
    print('starting server...')
 
    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http server, you need root access
    server_address = ('127.0.0.1', 8081)
    httpd = HTTPServer(server_address, HTTPServer_RequestHandler)
    print('running server...')
    httpd.serve_forever()
 
 
run()
