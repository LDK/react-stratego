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
import time

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

  def saveGameData(self, data):
    # Grab existing game data
    gameData = self.getGameData(data['id'], False)
    started = data['started']
    turn = "'"+data['turn']+"'" if (data['turn']) else 'NULL'
    # Decode spaces json data into list
    spaceInfo = json.loads(gameData['spaces'])
    newSpaceInfo = json.loads(data['spaces'])
    # Decode player json data into list
    players = json.loads(data['players'])
    if (players['blue']['ready']):
        starterReady = 1
    else:
        starterReady = 0
    if (players['red']['ready']):
        oppReady = 1
    else:
        oppReady = 0
    # Check user color, starter = blue, opponent = red
    starterUid = int(gameData['starter_uid'])
    senderUid = int(data['sender'])
    userColor = 'blue' if (starterUid == senderUid) else 'red'
    # Remove existing spaces that match user color from list
    i = 0
    combinedSpaces = {}
    for i in spaceInfo:
        space = spaceInfo[i]
        if space['color'] != userColor:
            combinedSpaces[space['id']] = spaceInfo[i]
    # Add new user color-matching spaces to list
    for spaceIndex in newSpaceInfo:
        space = newSpaceInfo[spaceIndex]
        if space['color'] == userColor:
            combinedSpaces[space['id']] = space
    # Encode list into new json string
    spaceString = json.dumps(combinedSpaces)
    # Update spaces field in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET spaces='{spaces}', started='{started}', starter_ready='{starterReady}', opponent_ready='{oppReady}', turn={turn} WHERE id = '{id}'".\
        format(spaces=spaceString, starterReady=starterReady, oppReady=oppReady, id=data['id'], started=started, turn=turn)
    c.execute(updateSql)
    conn.commit()
    conn.close()
    savedId = data['id']
    return savedId

  def getBattleResult(self, data):
    # print("battle data",data)
    # Grab existing game data
    gameData = self.getGameData(data['game_id'], False)
    # Decode spaces json data into list
    spaces = json.loads(gameData['spaces'])
    # print("spaces before",spaces)
    captured = json.loads(gameData['captured'])
    spaceId = data['space_id']
    fromId = data['from_id']
    # print("from",fromId,"to",spaceId)
    attackRank = data['attack_rank']
    attackColor = data['attack_color']
    attacks = int(gameData['attacks']) + 1
    defeated = ''
    victory = False
    for spaceIndex in spaces: 
        space = spaces[spaceIndex]
        if (str(space['id']) == spaceId): 
            defendRank = space['rank']
            defendColor = space['color']

    del spaces[fromId]

    if (attackRank == defendRank):
        defeated = 'both'
    elif (defendRank == 'S'):
        # Spies always lose when attacked by anyone other than another spy
        defeated = defendColor
    elif (defendRank == 'F'):
        # Flag has been found!
        victory = attackColor
        defeated = defendColor
    elif (defendRank == 'B'):
        # Spies defuse bombs.
        if (attackRank == '8'):
            defeated = defendColor
        else:
            defeated = attackColor
        # Successful or not, bombs disappear when attacked.
        # print("deleting",spaceId)
        del spaces[spaceId]
    elif (attackRank == 'S'):
        if (defendRank == 1):
            defeated = defendColor
        else:
            defeated = attackColor
    else:
        # We have a numeric rank piece attacking a different numeric rank piece
        attackRank = int(attackRank)
        defendRank = int(defendRank)
        if (attackRank < defendRank):
            defeated = defendColor
        else:
            defeated = attackColor

    if (defeated == attackColor):
        captured.append(attackColor+'-'+str(attackRank))
    elif (defeated == defendColor):
        captured.append(defendColor+'-'+str(defendRank))
        # print("deleting",spaceId)
        del spaces[spaceId]
        newSpace = {}
        newSpace['id'] = spaceId
        newSpace['rank'] = attackRank
        newSpace['color'] = attackColor
        spaces[spaceId] = newSpace
    elif (defeated == 'both'):
        captured.append(attackColor+'-'+str(attackRank))
        captured.append(defendColor+'-'+str(defendRank))
        # print("deleting",spaceId,"and",fromId,spaces)
        if (spaceId in spaces):
            del spaces[spaceId]
        if (fromId in spaces):
            del spaces[fromId]

    postRes = {}
    postRes['defend_rank'] = defendRank
    postRes['attack_rank'] = attackRank
    postRes['defend_color'] = defendColor
    postRes['attack_color'] = attackColor
    postRes['defeated'] = defeated
    postRes['space_id'] = spaceId
    postRes['from_space_id'] = fromId
    postRes['time'] = time.time()
    if (victory):
        postRes['victory'] = victory

    # print("spaces after",spaces);

    # print("battle",postRes);
    # Update spaces & fields in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET spaces='{spaces}', captured='{captured}', turn='{defendColor}', attacks='{attacks}', last_attack='{lastAttack}' WHERE id = '{gameId}'".\
        format(spaces=json.dumps(spaces), captured=json.dumps(captured), defendColor=defendColor, gameId=data['game_id'], attacks=attacks, lastAttack = json.dumps(postRes))
    c.execute(updateSql)
    conn.commit()
    conn.close()
    postRes['captured'] = json.dumps(captured)
    return postRes

  def cancelRequest(self, uid, gameId):
    # Grab existing game data
    gameData = self.getGameData(gameId, False)
    uid = int(uid)
    starterUid = int(gameData['starter_uid'])
    postRes = {}
    if not (uid == starterUid):
        postRes['error'] = 'User id mismatch'
        return postRes
    # Update status field in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET status='cancelled' WHERE id = '{id}'".format(id=gameId)
    c.execute(updateSql)
    conn.commit()
    conn.close()
    postRes['cancelled'] = gameId
    return postRes

  def declineInvite(self, uid, gameId):
    # Grab existing game data
    gameData = self.getGameData(gameId, False)
    uid = int(uid)
    opponentUid = int(gameData['opponent_uid'])
    postRes = {}
    if not (uid == opponentUid):
        postRes['error'] = 'User id mismatch'
        return postRes
    # Update status field in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET status='declined' WHERE id = '{id}'".format(id=gameId)
    c.execute(updateSql)
    conn.commit()
    conn.close()
    postRes['declined'] = gameId
    return postRes

  def acceptInvite(self, uid, gameId):
    # Grab existing game data
    gameData = self.getGameData(gameId, False)
    uid = int(uid)
    opponentUid = int(gameData['opponent_uid'])
    postRes = {}
    if not (uid == opponentUid):
        postRes['error'] = 'User id mismatch'
        return postRes
    # Update status field in db
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    updateSql = "UPDATE `game` SET status='active' WHERE id = '{id}'".format(id=gameId)
    c.execute(updateSql)
    conn.commit()
    conn.close()
    gameRes = {}
    gameRes['starter_uid'] = uid
    gameRes['opponent_uid'] = opponentUid
    gameRes['id'] = gameId
    postRes['accepted'] = gameRes
    return postRes

  def joinGame(self, mode, uid, gameId):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    postRes = {}
    usernameSql = "SELECT username from user where id = '{uid}'".format(uid=uid)
    c.execute(usernameSql)
    userData = c.fetchone()
    userName = userData[0]
    if (mode == 'random'):
        # Find random open game not started by user
        selectSql = "select id, title from game where opponent_user_id IS NULL and starting_user_id <> {uid} ORDER BY RANDOM() LIMIT 1".format(uid=uid)
        c.execute(selectSql)
        gameData = c.fetchone()
        if gameData:
            gameId = gameData[0]
            title = gameData[1].replace('(open)',userName)
            # Set opponent id of random game to user id
            # Set game to active
            # Update game title
            joinSql = "UPDATE game SET opponent_user_id = {uid}, title = '{title}', status = 'active' where id = {gid}".format(uid=uid, title=title,gid=gameId)
            c.execute(joinSql)
            postRes['game_id'] = gameId
            postRes['title'] = title
        else:
            # Find random user
            oppSql = "SELECT id FROM user WHERE id <> {uid} ORDER BY RANDOM() LIMIT 1".format(uid=uid)
            c.execute(oppSql)
            oppData = c.fetchone()
            oppId = oppData[0]
            # Create pending game request with random user as opponent
            postRes = self.newGame(uid,oppId)
    if (mode == 'join'):
        selectSql = "select title from game where id = {gid}".format(gid=gameId)
        c.execute(selectSql)
        gameData = c.fetchone()
        title = gameData[0].replace('(open)',userName)
        # update game with id of gameId to have user as opponent
        # update game title
        joinSql = "UPDATE game SET opponent_user_id = {uid}, title = '{title}', status = 'active' where id = {gid}".format(uid=uid, title=title, gid=gameId)
        c.execute(joinSql)
        postRes['game_id'] = gameId
        postRes['title'] = title
    conn.commit()
    conn.close()
    return postRes

  def newGame(self, starterId, opponentId):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    if not opponentId:
        selectSql = "SELECT s.username as starter_name from user s where s.id = '{sid}'".\
        format(sid=starterId)
    else:
        selectSql = "SELECT s.username as starter_name, o.username as opponent_name from user s left join user o where s.id = '{sid}' and o.id = '{oid}'".\
        format(sid=starterId, oid=opponentId)
    c.execute(selectSql)
    userData = c.fetchone()
    gameStatus = 'pending' if opponentId else 'open'
    if opponentId:
        title = "{starter} vs {opponent}".format(starter=userData[0], opponent=userData[1])
    else:
        title = "{starter} vs (open)".format(starter=userData[0])
        opponentId = "NULL"
    insertSql = "INSERT INTO `game` (starting_user_id, opponent_user_id, title, status) VALUES ('{starterId}',{oppId},'{title}','{gameStatus}')".\
        format(starterId=starterId, oppId=opponentId, title=title, gameStatus=gameStatus)
    c.execute(insertSql)
    conn.commit()
    conn.close()
    savedId = c.lastrowid
    postRes = {}
    postRes['game_id'] = savedId
    return postRes

  def getGameData(self, id, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as starter_name, g.opponent_user_id, ou.username as opponent_name, g.spaces, g.starter_ready, g.opponent_ready, g.status, g.started, g.turn, g.captured, g.attacks, g.last_attack FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.id = '{id}'".format(id=id)
    c.execute(selectSql)
    gameData = c.fetchone()
    postRes = {}
    if not uid:
        postRes['spaces'] = gameData[6]
    else:
        starterUid = int(gameData[2])
        uid = int(uid)
        spaceInfo = json.loads(gameData[6])
        combinedSpaces = {}
        if (starterUid == uid):
            userColor = 'blue'
        else:
            userColor = 'red'
        for i in spaceInfo:
            space = spaceInfo[i]
            if space['color'] != userColor:
                space['rank'] = None
            combinedSpaces[space['id']] = space
        postRes['spaces'] = json.dumps(combinedSpaces)
    postRes['title'] = gameData[0]
    postRes['id'] = gameData[1]
    postRes['starter_uid'] = gameData[2]
    postRes['starter_name'] = gameData[3]
    postRes['opponent_uid'] = gameData[4]
    postRes['opponent_name'] = gameData[5]
    postRes['starter_ready'] = gameData[7]
    postRes['opponent_ready'] = gameData[8]
    postRes['status'] = gameData[9]
    postRes['started'] = gameData[10]
    postRes['turn'] = gameData[11]
    postRes['captured'] = gameData[12]
    postRes['attacks'] = gameData[13]
    postRes['last_attack'] = gameData[14]
    conn.commit()
    conn.close()
    return postRes

  def getOpponentData(self, gameId, uid):
    if not uid:
        return {}
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.starting_user_id, g.opponent_user_id, g.spaces, g.starter_ready, g.opponent_ready, g.started, g.turn, g.attacks, g.last_attack FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id INNER JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.id = '{id}'".format(id=gameId)
    c.execute(selectSql)
    gameData = c.fetchone()
    postRes = {}
    postRes['game_id'] = gameId;
    starterUid = int(gameData[0])
    uid = int(uid)
    spaceInfo = json.loads(gameData[2])
    combinedSpaces = {}
    oppSoldiers = 0
    if (starterUid == uid):
        userColor = 'blue'
        opponentReady = gameData[4]
    else:
        userColor = 'red'
        opponentReady = gameData[3]
    for spaceIndex in spaceInfo:
        space = spaceInfo[spaceIndex]
        if space['color'] != userColor:
            if (space['rank'] != 'B' and space['rank'] != 'F'):
                oppSoldiers += 1
            space['rank'] = None
            combinedSpaces[space['id']] = space
    postRes['opponent_spaces'] = json.dumps(combinedSpaces)
    postRes['opponent_ready'] = opponentReady
    postRes['started'] = gameData[5]
    postRes['turn'] = gameData[6]
    postRes['attacks'] = gameData[7]
    postRes['last_attack'] = gameData[8]
    postRes['soldiers_remaining'] = oppSoldiers
    conn.commit()
    conn.close()
    return postRes

  def getUserList(self,uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT id, username FROM `user`WHERE id <> '{id}' ORDER BY username ASC".format(id=uid)
    c.execute(selectSql)
    users = c.fetchall()
    conn.close()
    postRes = {}
    
    for user in users:
        userId = user[0]
        userName = user[1]
        postRes[userId] = userName
            
    return postRes

  def getPastOpponents(self, uid):
    if not uid:
        return {}
    uid = int(uid)
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT DISTINCT g.starting_user_id, g.opponent_user_id, s.username as starter_name, o.username as opponent_name FROM `game` g INNER JOIN `user` s ON s.id = g.starting_user_id INNER JOIN `user` o ON o.id = g.opponent_user_id WHERE g.starting_user_id = '{id}' OR g.opponent_user_id = '{id}'".format(id=uid)
    c.execute(selectSql)
    games = c.fetchall()
    conn.close()
    postRes = {}
    
    for game in games:
        if (int(game[0]) == uid):
            opponentId = game[1]
            opponentName = game[3]
        else:
            opponentId = game[0]
            opponentName = game[2]
        if not (game[opponentId] in postRes):
            postRes[opponentId] = opponentName
    return postRes


    c.execute(selectSql)
    gameData = c.fetchone()
    postRes = {}
    starterUid = int(gameData[0])
    spaceInfo = json.loads(gameData[2])
    combinedSpaces = {}
    if (starterUid == uid):
        userColor = 'blue'
        opponentReady = gameData[4]
    else:
        userColor = 'red'
        opponentReady = gameData[3]
    i = 0
    while i < len(spaceInfo):
        space = spaceInfo[i]
        if space['color'] != userColor:
            space['rank'] = None
            combinedSpaces[space['id']] = spaceInfo[i]
        i += 1
    postRes['opponent_spaces'] = json.dumps(combinedSpaces)
    postRes['opponent_ready'] = opponentReady
    conn.commit()
    conn.close()
    return postRes

  def getOpenGames(self, uid):
    if not uid:
        return {}
    uid = int(uid)
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT DISTINCT g.id, g.title, u.username FROM game g INNER JOIN user u ON u.id = g.starting_user_id WHERE u.id <> {uid} AND g.opponent_user_id IS NULL".format(uid=uid)
    c.execute(selectSql)
    games = c.fetchall()
    conn.close()
    postRes = {}
    for game in games:
        gameId = game[0]
        entry = {}
        entry['title'] = game[1]
        entry['starter_name'] = game[2]
        postRes[gameId] = entry
    return postRes

  def getGameList(self, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as starter_name, g.opponent_user_id, ou.username as opponent_name, g.started FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status IN ('active','open') AND (starting_user_id = '{uid}' OR opponent_user_id = '{uid}')".format(uid=uid)
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
        postRes[game[1]]['started'] = game[6]
    return postRes

  def getOutgoingRequests(self, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.opponent_user_id, ou.username as opponent_name FROM `game` g INNER JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status = 'pending' AND g.starting_user_id = '{uid}'".format(uid=uid)
    c.execute(selectSql)
    games = c.fetchall()
    conn.close()
    postRes = {}
    for game in games:
        if not (game[1] in postRes):
            postRes[game[1]] = {}
        postRes[game[1]]['title'] = game[0]
        postRes[game[1]]['game_id'] = game[1]
        postRes[game[1]]['opponent_uid'] = game[2]
        postRes[game[1]]['opponent_name'] = game[3]
    return postRes

  def getIncomingInvites(self, uid):
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as starter_name FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id WHERE g.status = 'pending' AND g.opponent_user_id = '{uid}'".format(uid=uid)
    c.execute(selectSql)
    games = c.fetchall()
    conn.close()
    postRes = {}
    for game in games:
        if not (game[1] in postRes):
            postRes[game[1]] = {}
        postRes[game[1]]['title'] = game[0]
        postRes[game[1]]['game_id'] = game[1]
        postRes[game[1]]['opponent_uid'] = game[2]
        postRes[game[1]]['opponent_name'] = game[3]
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
        
    elif (self.path == '/new_game'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        oppId = postvars['opponent_id'][0] if ('opponent_id' in postvars) else None
        gameId = postvars['game_id'][0] if ('game_id' in postvars) else None
        actionMode = postvars['mode'][0]
        if (actionMode == 'random' or actionMode == 'join'):
            postRes = self.joinGame(actionMode, uid, gameId)
        else:
            postRes = self.newGame(uid,oppId)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/opponent_status'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['game_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getOpponentData(gid,uid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
                
    elif (self.path == '/join_game'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['game_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.joinGame('join', uid, gid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/cancel_request'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['game_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.cancelRequest(uid,gid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/decline_invite'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['game_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.declineInvite(uid,gid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/accept_invite'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        gid = postvars['game_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.acceptInvite(uid,gid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/past_opponents'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getPastOpponents(uid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/open_games'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getOpenGames(uid)
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
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/incoming_invites'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getIncomingInvites(uid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/outgoing_requests'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        self.respond(200)
        postRes = self.getOutgoingRequests(uid)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        conn.close()
        return
        
    elif (self.path == '/saveGame'):
        postvars = self.parse_POST()
        postRes = {}
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        turn = postvars['turn'][0] if ('turn' in postvars) else None
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        if ('game_id' in postvars and postvars['game_id'][0]):
            gameId = postvars['game_id'][0]
            self.saveGameData({
                "spaces": postvars['spaces'][0],
                "players": postvars['players'][0],
                "captured": postvars['captured'][0],
                "started": postvars['started'][0],
                "id": gameId,
                "sender": uid,
                "turn": turn
            })
        else:
            return
        postRes['id'] = gameId
        self.respond(200)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))
        
    elif (self.path == '/usernames'):
        postvars = self.parse_POST()
        userKey = postvars['userKey'][0]
        uid = postvars['user_id'][0]
        authorized = self.checkCreds(uid,userKey)
        if not authorized:
            self.respond(401)
            return
        postRes = self.getUserList(uid)
        self.respond(200)
        self.wfile.write(json.dumps(postRes).encode("utf-8"))

    elif (self.path == '/battle'):
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
            postRes = self.getBattleResult({
                "space_id": postvars['space_id'][0],
                "from_id": postvars['from_space_id'][0],
                "attack_rank": postvars['attack_rank'][0],
                "attack_color": postvars['attack_color'][0],
                "spaces": postvars['spaces'][0],
                "attacker_id": uid,
                "game_id": gameId
            })
        else:
            return
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
