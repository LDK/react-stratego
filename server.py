#!/usr/bin/env python
 
from os import curdir, rename
from os.path import join as pjoin
from cgi import parse_header, parse_multipart
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
sqlite_file = './stratego.sqlite'
import json
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

  def saveGameData(self, data):
    # Grab existing game data
    gameData = self.getGameData(data['id'], False)
    # Decode spaces json data into list
    spaceInfo = json.loads(gameData['spaces'])
    newSpaceInfo = json.loads(data['spaces'])
    # Check user color, starter = blue, opponent = red
    starterUid = int(gameData['starter_uid'])
    senderUid = int(data['sender'])
    userColor = 'blue' if (starterUid == senderUid) else 'red'
    # Remove existing spaces that match user color from list
    i = 0
    combinedSpaces = []
    while i < len(spaceInfo):
        space = spaceInfo[i]
        if space['color'] != userColor:
            combinedSpaces.append(spaceInfo[i])
        i += 1
    # Add new user color-matching spaces to list
    for space in newSpaceInfo:
        if space['color'] == userColor:
            combinedSpaces.append(space)
    # Encode list into new json string
    spaceString = json.dumps(combinedSpaces)
    # Update spaces field in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET spaces='{spaces}' WHERE id = '{id}'".\
        format(spaces=spaceString, id=data['id'])
    c.execute(updateSql)
    conn.commit()
    conn.close()
    savedId = data['id']
    return savedId;

  def getGameData(self, id, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as starter_name, g.opponent_user_id, ou.username as opponent_name, g.spaces FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id INNER JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.id = '{id}'".format(id=id)
    c.execute(selectSql)
    gameData = c.fetchone()
    postRes = {}
    if not uid:
        postRes['spaces'] = gameData[6]
    else:
        starterUid = int(gameData[2])
        uid = int(uid)
        spaceInfo = json.loads(gameData[6])
        combinedSpaces = []
        if (starterUid == uid):
            userColor = 'blue'
        else:
            userColor = 'red'
        i = 0
        while i < len(spaceInfo):
            space = spaceInfo[i]
            if space['color'] != userColor:
                space['rank'] = None
            combinedSpaces.append(spaceInfo[i])
            i += 1
        postRes['spaces'] = json.dumps(combinedSpaces)
    postRes['title'] = gameData[0]
    postRes['id'] = gameData[1]
    postRes['starter_uid'] = gameData[2]
    postRes['starter_name'] = gameData[3]
    postRes['opponent_uid'] = gameData[4]
    postRes['opponent_name'] = gameData[5]
    conn.commit()
    conn.close()
    return postRes

  def getGameList(self, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as starter_name, g.opponent_user_id, ou.username as opponent_name FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id INNER JOIN `user` ou ON ou.id = g.opponent_user_id WHERE starting_user_id = '{uid}' OR opponent_user_id = '{uid}'".format(uid=uid)
    c.execute(selectSql)
    games = c.fetchall()
    conn.close()
    postRes = {}
    for game in games:
        if not (game[1] in postRes):
            postRes[game[1]] = {}
        postRes[game[1]]['title'] = game[0]
        postRes[game[1]]['id'] = game[1]
        postRes[game[1]]['starter_uid'] = game[2]
        postRes[game[1]]['starter_name'] = game[3]
        postRes[game[1]]['opponent_uid'] = game[4]
        postRes[game[1]]['opponent_name'] = game[5]
    return postRes

  def checkCreds(self,user_id,userKey):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    credSql = "SELECT id FROM `user` WHERE `id` = '{uid}' AND `userKey` = '{userKey}'".\
        format(uid=user_id, userKey=userKey)
    c.execute(credSql)
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
        
    elif (self.path == '/game'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getGameData(gid,uid)
        postRes['id'] = gid
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/games'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getGameList(uid)
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
    elif (self.path == '/saveGame'):
        postvars = self.parse_POST()
        postRes = {}
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        if ('game_id' in postvars and postvars['game_id'][0]):
            gameId = postvars['game_id'][0]
            self.saveGameData({
                "spaces": postvars['spaces'][0],
                "captured": postvars['captured'][0],
                "id": gameId,
                "sender": uid
            })
        else:
            return
        postRes['id'] = gameId
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
