var md5 = require('md5');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var cloneDeep = require('lodash/cloneDeep');
const Config =  require('../src/Config.js');

var restapi = express();
restapi.use(express.static('public'));
restapi.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
restapi.use(bodyParser.urlencoded({ extended: true })); 
restapi.use(bodyParser.json());

var db = new sqlite3.Database('stratego.sqlite');

restapi.replaceUsernames = function(text) {
	var re = /(<@(.*?)>)/gi;
	var usernames = text.match(re);
	if (usernames) {
		_.each(usernames,function(username,key){
			username = username.replace('<@','').replace('>','');
			if (restapi.userLookup[username]) {
				text = text.replace('<@' + username + '>', restapi.userLookup[username].display);
			}
		});
	}
	return text;
}

String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};

var randomString = function(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
db.serialize(function() {
	db.run(`
		CREATE TABLE IF NOT EXISTS "game" (
			"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
			"title"	TEXT NOT NULL DEFAULT 'Untitled',
			"starting_user_id"	INTEGER NOT NULL,
			"opponent_user_id"	INTEGER,
			"spaces"	BLOB NOT NULL DEFAULT '{}',
			"captured"	BLOB NOT NULL DEFAULT '[]',
			"starter_ready"	INTEGER NOT NULL DEFAULT 0,
			"opponent_ready"	INTEGER NOT NULL DEFAULT 0,
			"status"	TEXT NOT NULL DEFAULT 'pending',
			"started"	INTEGER DEFAULT 0,
			"turn"	TEXT,
			"attacks"	INTEGER NOT NULL DEFAULT 0,
			"last_attack"	BLOB NOT NULL DEFAULT '{}',
			"last_move"	BLOB NOT NULL DEFAULT '{}'
		);
	`);
	db.run(`
		CREATE TABLE IF NOT EXISTS "user" (
			"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
			"username"	TEXT UNIQUE,
			"password"	TEXT,
			"email"	TEXT UNIQUE,
			"userKey"	TEXT UNIQUE
		);
	`);
	db.run(`
		CREATE TABLE IF NOT EXISTS "user_options" (
			"user_id"	INTEGER NOT NULL,
			"option_name"	TEXT NOT NULL,
			"option_value"	TEXT NOT NULL
		);
	`);
	restapi.userLookup = {};
});

var getUserData = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "select u.id, u.username, u.userKey, u.email, rand.option_value as random_available, invite.option_value as invite_available from user u left join user_options invite on invite.user_id = u.id and invite.option_name = 'inviteAvailable'  left join user_options rand  on rand.user_id = u.id and rand.option_name = 'randomAvailable' where u.id = " + uid;
		db.get(selectSql, [], function(error, row) {
			if (error) {
				reject(error);
			}
			else if (!row) {
				reject('User not found');
			}
			else {
				resolve(row);
			}
		});
	});
};

var checkCreds = function(body) {
	var {user_id, userKey} = body;
	return new Promise((resolve, reject) => {
		var credSql = "SELECT id, last_active FROM `user` WHERE `id` = '"+user_id+"' AND `userKey` = '"+userKey+"'";
		var queries = [];
		db.get(credSql, [], function(error, row) {
			if (error) {
				reject(error);
			} else if (!row) {
				reject('Invalid user ID/user key combo ('+user_id+', '+userKey+')');
			}
			else {
				setLastActive(user_id, row.last_active).then(function(result) {
					resolve(row.id);
				});
			}
		});
	});
};

var setLastActive = function(user_id, previous_ts) {
	return new Promise((resolve, reject) => {
		var now_ts = Date.now() / 1000;
		if (now_ts - previous_ts > 15) {
			var updateSql = "UPDATE `user` SET last_active='"+ parseInt(now_ts) +"' WHERE `id` = '" + user_id + "'";
			db.run(updateSql, [], function(error){
				if (error) {
					reject(error);
				}
				else {
					resolve(now_ts);
				}
			});
		}
		else {
			resolve(previous_ts);
		}
	});
};

var updateLastMove = function(gameId, moveData) {
	// Update last_move field in db
	moveData = (typeof moveData == 'string') ? JSON.parse(moveData) : moveData;
	return new Promise((resolve, reject) => {
		if (!gameId) {
			reject('No Game Id');
		}
		if (!moveData) {
			reject('No Move Data');
		}
		moveData['ts'] = Date.now();
		var updateSql = "UPDATE `game` SET last_move='"+JSON.stringify(moveData)+"', last_move_ts = " + moveData.ts + " WHERE id = '"+gameId+"'";
		db.run(updateSql, [], function(error){
			if (error) {
				reject(error);
			}
			else {
				resolve(moveData);
			}
		});
	});
};

var getGameData = function(gameId, uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT g.title, g.id, g.started_ts, g.starting_user_id, su.username as starter_name, g.opponent_user_id, ou.username as opponent_name, g.spaces, g.starter_ready, g.opponent_ready, g.status, g.started, g.turn, g.captured, g.attacks, g.last_attack, g.last_move, g.last_move_ts, g.finished_ts, g.result, g.winner FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.id = '" + gameId + "'";
		db.get(selectSql, [], function(error,row){
			if (!row) {
				reject('No game data found.');
				return;
			}
			if (error) {
				reject(error);
				return;
			}
			rv = {};
			if (row.status == 'done') {
				rv.spaces = row.spaces;
			}
			else {
				uid = parseInt(uid);
				var starterUid = parseInt(row.starting_user_id);
				var userColor = (starterUid == uid) ? 'blue' : 'red';
				if (isNaN(uid)) {
					userColor = false;
				}
				var spaceInfo = JSON.parse(row.spaces);
				var combinedSpaces = {};
				for (var i in spaceInfo) {
					var space = spaceInfo[i];
					if (userColor && space.color != userColor) {
						space.rank = null;
					}
					combinedSpaces[space.id] = space;
				}
				rv.spaces = JSON.stringify(combinedSpaces);
			}
			rv.title = row.title;
			rv.id = row.id;
			rv.started_ts = row.started_ts;
			rv.starter_uid = row.starting_user_id;
			rv.starter_name = row.starter_name;
			rv.opponent_uid = row.opponent_user_id;
			rv.opponent_name = row.opponent_name;
			rv.starter_ready = row.starter_ready;
			rv.opponent_ready = row.opponent_ready;
			rv.status = row.status;
			rv.started = row.started;
			rv.turn = row.turn;
			rv.captured = row.captured;
			rv.attacks = row.attacks;
			rv.last_attack = row.last_attack;
			rv.last_move = row.last_move;
			rv.winner_uid = row.winner;
			rv.finished_ts = row.finished_ts;
			rv.last_move_ts = row.last_move_ts;
			rv.result = rv.result;
			resolve(rv);
		});
	});
};

var getUserList = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT id, username FROM `user` WHERE id <> '"+uid+"' ORDER BY username ASC";
		db.all(selectSql, [], (err, users) => {
			if (err) {
				reject(err);
			}
			var userList = {};
			for (var i in users) {
				var { id, username } = users[i];
				userList[id] = username;
			}
			resolve(userList);
		});
	});
};

var getPastOpponents = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT DISTINCT g.starting_user_id, g.opponent_user_id, s.username as starter_name, o.username as opponent_name FROM `game` g INNER JOIN `user` s ON s.id = g.starting_user_id INNER JOIN `user` o ON o.id = g.opponent_user_id WHERE g.starting_user_id = '"+uid+"' OR g.opponent_user_id = '"+uid+"'";
		var result = {};
		db.all(selectSql, [], (err, games) => {
			if (err) {
				reject(err);
			}
			for (var gameIndex in games) {
				var game = games[gameIndex];
				if (game.starting_user_id == uid) {
					var opponentId = game.opponent_user_id;
					var opponentName = game.opponent_name;
				}
				else {
					var opponentId = game.starting_user_id;
					var opponentName = game.starter_name;
				}
				result[opponentId] = opponentName;
			}
			resolve(result);
		});
	});
};

var getUserProfile = function(uid,requestingUid) {
	return new Promise((resolve, reject) => {
		selectSql = "select id as uid, username, email, wins, losses, forfeits, last_active, join_date from user where user.id = " + uid;
		var result = {};
		db.get(selectSql, [], (err, info) => {
			if (err) {
				reject(err);
			}
			getRecentGames(uid).then(function(recentGames){
				if (recentGames) {
					for (var i in recentGames) {
						recentGames[i].name = recentGames[i].title;
					}
					info.recentGames = recentGames;
				}
				getHeadToHead(uid,requestingUid).then(function(headToHead){
					if (headToHead) {
						info.headtohead = headToHead;
						var score = {};
						score[requestingUid] = 0;
						score[uid] = 0;
						var leader = null;
						for (var i in headToHead) {
							var game = headToHead[i];
							score[game.winner]++;
						}
						if (score[uid] > score[requestingUid]) {
							leader = info.username;
						}
						else if (score[uid] < score[requestingUid]) {
							leader = '[%you]';
						}
						else {
							leader = 'Tied';
						}
						var scoreString = Math.max(score[uid],score[requestingUid]) + '-' + Math.min(score[uid],score[requestingUid]);
						info.advantage = leader + ', ' + scoreString;
					}
					resolve(info);
				});
			});
		});
	});
};

var getNotification = function(id){
	return new Promise((resolve, reject) => {
		var selectSql = "SELECT id, category, text, user_id, added_ts, seen_ts, additional FROM notification where id = " + id;
		db.get(selectSql, [], (err, notification) => {
			if (err) {
				reject(err);
			}
			resolve(notification);
		});
	});
}

var markSeen = function(uid,notification_ids) {
	return new Promise((resolve, reject) => {
		var idList = notification_ids.join(',');
		// Update spaces field in db
		var updateSql = "UPDATE `notification` SET seen_ts='"+Date.now()+"' WHERE id IN (" + idList + ") AND user_id = '" + uid + "'";
		db.run(updateSql, [], function(error) {
			if (error) {
				reject(error);
			}
			else {
				for (var i in notification_ids) {
					var nid = notification_ids[i];
					getNotification(nid).then(function(notification){
						if (notification.category == 'invite-declined') {
							deleteNotification(notification.id).then(function(){
								// We deleted the notification
							});
						}
					});
				}
				resolve(idList);
			}
		});
	});
}

var saveGameData = function(data) {
	return new Promise((resolve, reject) => {
		getGameData(data.id, false).then(function(gameData){
			if (!gameData) {
				reject('Unable to retrieve game data');
			}
			var started = data.started;
			var turn = 'NULL';
			if (started) {
				if (gameData.turn == 'blue') {
					turn = "'red'";
				}
				else {
					turn = "'blue'";
				}
			}
			// Decode spaces json data into list
			var spaceInfo = JSON.parse(gameData.spaces);
			var newSpaceInfo = JSON.parse(data.spaces);
			// Decode player json data into list
			var players = JSON.parse(data.players);
			var starterReady = !!players['blue']['ready'];
			var oppReady = !!players['red']['ready'];
			// Check user color, starter = blue, opponent = red
			var starterUid = parseInt(gameData['starter_uid']);
			var senderUid = parseInt(data['sender']);
			var userColor = (starterUid == senderUid) ? 'blue' : 'red';
			var combinedSpaces = {};
			// Remove existing spaces that match user color from list
			for (var i in spaceInfo) {
				var space = spaceInfo[i];
				if (space.color != userColor) {
					combinedSpaces[space.id] = space;
				}
			}
			// Add new user color-matching spaces to list
			for (var spaceIndex in newSpaceInfo) {
				space = newSpaceInfo[spaceIndex];
				if (space.color == userColor) {
					combinedSpaces[space.id] = space;
				}
			}
			// Encode list into new json string
			var spaceString = JSON.stringify(combinedSpaces);
			// Update spaces field in db
			var updateSql = '';
			if (started) {
				updateSql = "UPDATE `game` SET spaces='"+spaceString+"', started='1', turn='" + turn + "' WHERE id = '" + data.id + "' and turn='" + userColor + "'";
			}
			else {
				updateSql = "UPDATE `game` SET spaces='"+spaceString+"', started='0', starter_ready='" + (starterReady ? 1 : 0) + "', opponent_ready='" + (oppReady ? 1 : 0) + "', turn='" + turn + "' WHERE id = '" + data.id + "'";
			}
			updateSql = "UPDATE `game` SET spaces='"+spaceString+"', started='" + (started ? 1 : 0) + "', starter_ready='" + (starterReady ? 1 : 0) + "', opponent_ready='" + (oppReady ? 1 : 0) + "', turn=" + turn + " WHERE id = '" + data.id + "'";
			db.run(updateSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve(data.id);
				}
			});
		});
	});
};

var getBattleResult = function(data) {
	return new Promise((resolve, reject) => {
		getGameData(data.game_id, false).then(function(gameData){
			var spaces = gameData.spaces ? JSON.parse(gameData.spaces) : {};
			var captured = gameData.captured ? JSON.parse(gameData.captured) : [];
			var gameStatus = gameData.status;
			var gameId = gameData.id;
			var spaceId = data.space_id;
			var fromId = parseInt(data.from_id);
			var attackRank = data.attack_rank;
			var attackColor = data.attack_color;
			var defendRank, defendColor;
			var attacks = parseInt(gameData.attacks) + 1;
			var defeated = '';
			var victory = false;
			var remaining = {
				blue: 0,
				red: 0
			};
			var starterUid = gameData.starter_uid;
			var opponentUid = gameData.opponent_uid;
			var uid = data.uid;
			var userColor = (starterUid == uid) ? 'blue' : 'red';
			var starterColor = 'blue';
			var oppColor = 'red';
			var gameResult = null;
			var winnerUid = null;
			var loserUid = null;
			var attackUid = (attackColor == userColor) ? uid : (userColor == starterColor ? opponentUid : starterUid);
			var defendUid = (defendColor == userColor) ? uid : (userColor == starterColor ? opponentUid : starterUid);
			// console.log(attackUid,'attacks',defendUid);
			for (var spaceIndex in spaces) {
				var space = spaces[spaceIndex];
				if (spaceId == space.id) {
					defendRank = space.rank;
					defendColor = space.color;
				}
				if (space.rank != 'B' && space.rank != 'F') {
					remaining[space.color]++;
				}
				delete spaces[fromId];
			}
			if (attackRank == defendRank) {
				defeated = 'both';
			}
			else if (defendRank == 'S') {
				// Spies always lose when attacked by anyone other than another spy
				defeated = defendColor;
			}
			else if (defendRank == 'F') {
				// Flag has been found!
				victory = attackColor;
				// if user is attacker, winner uid is user id
				// If user is defender, winner uid is either starterUid or opponentUid, whichever the user is not.
				// I know how convoluted that is.
				defeated = defendColor;
				gameResult = 'flag';
			}
			else if (defendRank == 'B') {
				// Miners defuse bombs.
				if (attackRank == '8') {
					defeated = defendColor;
				}
				else {
					defeated = attackColor;
				}
				// Successful or not, bombs disappear when attacked.
				delete spaces[spaceId];
			}
			else if (attackRank == 'S') {
				// Miners defuse bombs.
				if (defendRank == '1') {
					defeated = defendColor;
				}
				else {
					defeated = attackColor;
				}
			}
			else {
				// We have a numeric rank piece attacking a different numeric rank piece
				attackRank = parseInt(attackRank);
				defendRank = parseInt(defendRank);
				if (attackRank < defendRank) {
					defeated = defendColor;
				}
				else {
					defeated = attackColor;
				}
			}
			if (defeated == attackColor) {
				captured.push(attackColor+'-'+attackRank);
			}
			else if (defeated == defendColor) {
				captured.push(defendColor+'-'+defendRank);
				spaces[spaceId] = {
					id: spaceId,
					rank: attackRank,
					color: attackColor
				};
			}
			else if (defeated == 'both') {
				captured.push(attackColor+'-'+attackRank);
				captured.push(defendColor+'-'+defendRank);
				if (spaceId in spaces) {
					delete spaces[spaceId];
				}
				if (fromId in spaces) {
					delete spaces[fromId];
				}
			}
			if (defeated == defendColor && defendRank != 'B' && defendRank != 'F') {
				remaining[defeated]--;
			}
			else if (defeated == attackColor) {
				remaining[defeated]--;
			}
			else if (defeated == 'both') {
				remaining.blue--;
				remaining.red--;
			}
			if (remaining.red < 1 && remaining.blue < 1) {
				victory = 'draw';
				gameResult = 'soldiers';
			}
			else if (remaining.red < 1) {
				victory = 'blue';
				gameResult = 'soldiers';
			}
			else if (remaining.blue < 1) {
				victory = 'red';
				gameResult = 'soldiers';
			}
			if (victory) {
				if (victory != 'draw') {
					winnerUid = (victory == 'blue') ? starterUid : opponentUid;
					loserUid = (victory == 'red') ? starterUid : opponentUid;
					gameStatus = 'done';
				}
				else {
					gameStatus = 'draw';
				}
			}
			var result = {
				defend_rank: defendRank,
				attack_rank: attackRank,
				defend_color: defendColor,
				attack_color: attackColor,
				defeated: defeated,
				remaining: remaining,
				space_id: spaceId,
				from_space_id: fromId,
				time: Date.now(),
				status: gameStatus
			}
			var ts = 'NULL';
			if (victory) {
				result.victory = victory;
				result.winner = winnerUid;
				result.loser = loserUid;
				ts = Date.now();
			}
			var updateSql = "UPDATE `game` SET status='"+gameStatus+"', spaces='"+JSON.stringify(spaces)+"', captured='"+JSON.stringify(captured)+"', turn='"+defendColor+"', attacks='"+attacks+"', last_attack='"+JSON.stringify(result)+"', result=" + (gameResult ? "'" + gameResult + "'" : 'NULL') + ", winner = " + (winnerUid ? winnerUid : 'NULL') + ", loser = " + (loserUid ? loserUid : 'NULL') + ", finished_ts = " + ts + " WHERE id = '"+gameId+"'";
			db.run(updateSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					result.captured = captured;
					resolve(result);
					updateRecord(winnerUid);
					updateRecord(loserUid);
				}
			});
		});
	});
};

var cancelRequest = function(uid,gameId) {
	return new Promise((resolve, reject) => {
		getGameData(gameId, false).then(function(gameData) {
			var starterUid = gameData.starter_uid;
			var result = {};
			if (uid != starterUid) {
				result.error = 'User id mismatch';
				reject(result);
			}
			var updateSql = "UPDATE `game` SET status='cancelled' WHERE id = '"+gameId+"'";
			db.run(updateSql, [], function(error){
				if (error) {
					reject(error);
				}
				else {
					result.cancelled = gameId;
					resolve(result);
				}
			});
		});
	});
}

var updateRecord = function(uid) {
	var updateSql = "UPDATE `user` set wins = (SELECT count(id) from game where winner = "+uid+"), losses = (SELECT count(id) from game where loser = "+uid+") where id = "+uid;
	db.run(updateSql, [], function(error){
		if (error) {
			console.log(error);
		}
		else {
			// Success
		}
	});
}

var declineInvite = function(uid, gameId) {
	return new Promise((resolve, reject) => {
		getGameData(gameId, false).then(function(gameData) {
			var result = {};
			if (uid != gameData.opponent_uid) {
				result.error = 'User id mismatch';
				reject(result);
			}
			var updateSql = "UPDATE `game` SET status='declined' WHERE id = '"+gameId+"'";
			db.run(updateSql, [], function(error){
				if (error) {
					reject(error);
				}
				else {
					result.declined = {
						starter_uid: gameData.starter_uid,
						opponent_uid: gameData.opponent_uid,
						starter_name: gameData.starter_name,
						opponent_name: gameData.opponent_name,
						id: gameId
					};
					resolve(result);
				}
			});
		});
	});
}

var markOpenGameViewed = function(uid,gameId) {
	return new Promise((resolve,reject) => {
		var deleteSql = "delete from notification where user_id = " + uid + " and category = 'open-joined' and additional LIKE '%game_id\":" + gameId + "%';";
		db.run(deleteSql, [], function(error){
			if (error) {
				reject(error);
			}
			else {
				resolve(true);
			}
		});
	});
}

var acceptInvite = function(uid, gameId) {
	return new Promise((resolve, reject) => {
		getGameData(gameId, false).then(function(gameData) {
			var result = {};
			if (uid != gameData.opponent_uid) {
				result.error = 'User id mismatch';
				reject(result);
			}
			var updateSql = "UPDATE `game` SET status='active' WHERE id = '"+gameId+"'";
			db.run(updateSql, [], function(error){
				if (error) {
					reject(error);
				}
				else {
					result.accepted = {
						starter_uid: gameData.starter_uid,
						opponent_uid: gameData.opponent_uid,
						starter_name: gameData.starter_name,
						opponent_name: gameData.opponent_name,
						id: gameId
					};
					resolve(result);
				}
			});
		});
	});
}

var newGame = function(starterId, opponentId) {
	return new Promise((resolve, reject) => {
		if (!opponentId) {
			selectSql = "SELECT s.username as starter_name from user s where s.id = "+starterId;
		}
		else {
			selectSql = "SELECT s.username as starter_name, o.username as opponent_name from user s left join user o where s.id = "+starterId+" and o.id = "+opponentId;
		}
		db.get(selectSql, [], function(err, userData) {
			var gameStatus = opponentId ? 'pending' : 'open';
			if (opponentId) {
				var title = userData.starter_name + ' vs ' + userData.opponent_name;
			} else {
				var title = userData.starter_name + ' vs (open)';
				opponentId = "NULL";
			}
			var insertSql = "INSERT INTO `game` (starting_user_id, opponent_user_id, title, status) VALUES ("+starterId+","+opponentId+",'"+title+"','"+gameStatus+"')";
			db.run(insertSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve({
						created: {
							starter_uid: starterId,
							opponent_uid: opponentId,
							starter_name: userData.starter_name,
							opponent_name: userData.opponent_name,
							id: this.lastID
						}
					});
				}
			});
		});
	});
};

var addNotification = function(notification) {
	return new Promise((resolve, reject) => {
		if (!notification || !notification.user_id || !notification.text) {
			reject("Insufficient data.  addNotification requires an object with at least a user_id and text");
		}
		else {
			var ts = Date.now();
			var insertSql = "INSERT INTO `notification` (user_id, text, category, added_ts, additional) VALUES (" + notification.user_id + ",'" + notification.text + "','" + (notification.category || 'general') + "',"+ts+",'" + JSON.stringify(notification.additional || {}) + "')";
			db.run(insertSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve({ notification_id: this.lastID });
				}
			});
		}
	});
};

var deleteNotification = function(id) {
	return new Promise((resolve, reject) => {
		if (!id) {
			reject("Insufficient data.  deleteNotification requires an id");
		}
		else {
			var ts = Date.now();
			var deleteSql = "DELETE FROM `notification` WHERE id = " + id;
			db.run(deleteSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve(id);
				}
			});
		}
	});
};

var deleteInvite = function(game_id) {
	return new Promise((resolve, reject) => {
		if (!game_id) {
			reject("Insufficient data.  deleteInvite requires a game_id");
		}
		else {
			var deleteSql = 'DELETE FROM notification WHERE additional LIKE ' + "'" + '%"game_id":' + game_id + '%' + "'" + ' and category = "invite-sent"';
			db.run(deleteSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve(game_id);
				}
			});
		}
	});
};

var deleteAcceptNotice = function(uid, game_id) {
	return new Promise((resolve, reject) => {
		if (!game_id) {
			reject("Insufficient data.  deleteAcceptNotice requires a game_id");
		}
		else {
			var deleteSql = 'DELETE FROM notification WHERE user_id = ' + uid + ' AND additional LIKE ' + "'" + '%"game_id":' + game_id + '%' + "'" + ' and category = "invite-accepted"';
			db.run(deleteSql, [], function(error) {
				if (error) {
					reject(error);
				}
				else {
					resolve(game_id);
				}
			});
		}
	});
};

var getOpponentData = function(gameId, uid) {
	return new Promise((resolve, reject) => {
		if (!uid) { resolve({}); }
		getGameData(gameId).then(function(gameData){
			result = { game_id: gameId };
			var starterUid = gameData.starter_uid;
			spaceInfo = JSON.parse(gameData.spaces);
			combinedSpaces = {};
			oppSoldiers = 0;
			var userColor, opponentReady;
			if (starterUid == uid) {
				userColor = 'blue';
				opponentReady = gameData.opponent_ready;
			}
			else {
				userColor = 'red';
				opponentReady = gameData.starter_ready;
			}
			for (var spaceIndex in spaceInfo) {
				var space = spaceInfo[spaceIndex];
				if (space.color != userColor) {
					if (space.rank != 'B' && space.rank != 'F') {
						oppSoldiers += 1;
					}
					space.rank = null;
					combinedSpaces[space.id] = space;
				}
			}
			result.opponent_spaces = JSON.stringify(combinedSpaces);
			result.opponent_ready = opponentReady;
			result.started = gameData.started;
			result.turn = gameData.turn;
			result.attacks = gameData.attacks;
			result.last_attack = gameData.last_attack;
			result.last_move = gameData.last_move;
			result.soldiers_remaining = oppSoldiers;
			resolve(result);
		});
	});
};

var getOpenGames = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT DISTINCT g.id, g.title, u.username FROM game g INNER JOIN user u ON u.id = g.starting_user_id WHERE u.id <> "+uid+" AND g.opponent_user_id IS NULL";
		db.all(selectSql, [], (err, games) => {
			if (err) {
				reject(err);
			}
			var gameList = {};
			for (var gameIndex in games) {
				var game = games[gameIndex];
				gameList[game.id] = {
					title: game.title,
					starter_name: game.username
				};
			}
			resolve(gameList);
		});
	});
};

var getHeadToHead = function(uid,opponent_uid)  {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT g.id, g.title as name, g.starting_user_id as starter_uid, su.username as starter_name, g.opponent_user_id as opponent_uid, ou.username as opponent_name, g.started, g.turn, g.last_move_ts, g.result, g.winner, g.status FROM game g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status='done' and ((g.starting_user_id = " + uid + " and g.opponent_user_id= " + opponent_uid + ") or (g.starting_user_id = " + opponent_uid + " and g.opponent_user_id= " + uid + "));";
		var result = {};
		db.all(selectSql, [], (err, games) => {
			if (err) {
				reject(err);
			}
			resolve(games);
		});
	});
};

var getRecentGames = function(uid) {
	return new Promise((resolve, reject) => {
		var query = "SELECT g.id, g.title, g.starting_user_id as starter_uid, su.username as starter_name, g.opponent_user_id as opponent_uid, ou.username as opponent_name, g.started, g.turn, g.last_move_ts, g.result, g.winner, g.status FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status = 'done' AND (starting_user_id = '" + uid+ "' OR opponent_user_id = '" + uid+ "') ORDER BY g.last_move_ts DESC LIMIT 3";

		db.all(query, [], (err, games) => {
			if (err) {
				reject(err);
			}
			resolve(games);
		});
	});
};

var getOutgoingRequests = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT g.title, g.id, g.opponent_user_id, ou.username as opponent_name FROM `game` g INNER JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status = 'pending' AND g.starting_user_id = " + uid;
		db.all(selectSql, [], (err, games) => {
			if (err) {
				reject(err);
			}
			var gameList = {};
			for (var gameIndex in games) {
				var game = games[gameIndex];
				gameList[game.id] = {
					title: game.title,
					game_id: game.id,
					opponent_uid: game.opponent_user_id,
					opponent_name: game.opponent_name
				};
			}
			resolve(gameList);
		});
	});
};

var getIncomingInvites = function(uid) {
	return new Promise((resolve, reject) => {
		selectSql = "SELECT g.title, g.id, g.starting_user_id, su.username as opponent_name FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id WHERE g.status = 'pending' AND g.opponent_user_id = " + uid;
		db.all(selectSql, [], (err, games) => {
			if (err) {
				reject(err);
			}
			var gameList = {};
			for (var gameIndex in games) {
				var game = games[gameIndex];
				gameList[game.id] = {
					title: game.title,
					game_id: game.id,
					opponent_uid: game.starting_user_id,
					opponent_name: game.opponent_name
				};
			}
			resolve(gameList);
		});
	});
};

var joinGame = function(mode, uid, gameId) {
	return new Promise((resolve, reject) => {
		var result = {};
		getUserData(uid).then(function(userData) {
			var username = userData.username;
			switch (mode) {
				case 'random':
				// Find random open game not started by user
				var selectSql = "select id, title from game where opponent_user_id IS NULL and starting_user_id <> "+uid+" ORDER BY RANDOM() LIMIT 1";
				db.get(selectSql,[],function(err, row){
					if (err) {
						reject(err);
					}
					if (row) {
						var gameId = row.id;
						var title = row.title.replace('open',username);
						// Set opponent id of random game to user id
						// Set game to active
						// Update game title
						var joinSql = "UPDATE game SET opponent_user_id = {"+uid+"}, title = '"+title+"', status = 'active' where id = "+gameId;
						db.run(joinSql, [], function(error){
							if (error) {
								reject(error);
							}
							getGameData(gameId).then(function(gameData){
								result.game_id = gameId;
								result.title = title;
								result.joined = {
									starter_uid: gameData.starter_uid,
									opponent_uid: gameData.opponent_uid,
									starter_name: gameData.starter_name,
									opponent_name: gameData.opponent_name,
									id: gameId
								};
								resolve(result);
							});
						});
					}
					else {
						// Find random user
						var oppSql = "SELECT id FROM user WHERE id <> "+uid+" ORDER BY RANDOM() LIMIT 1";
						db.get(oppSql, [], function(error, oppData) {
							if (error) {
								reject(error);
							}
							resolve(newGame(uid,oppData.id));
						});
					}
				});
				break;
				case 'join':
				getGameData(gameId).then(function(gameData){
					var title = gameData.title.replace('(open)',username);
					// update game with id of gameId to have user as opponent
					// update game title
					var joinSql = "UPDATE game SET opponent_user_id = "+uid+", title = '"+title+"', status = 'active' where id = "+gameId;
					db.run(joinSql,[],function(error) {
						if (error) {
							reject(error);
						}
						getGameData(gameId).then(function(gameData){
							result.game_id = gameId;
							result.title = title;
							result.joined = {
								starter_uid: gameData.starter_uid,
								opponent_uid: gameData.opponent_uid,
								starter_name: gameData.starter_name,
								opponent_name: gameData.opponent_name,
								id: gameId
							};
							resolve(result);
						});
					});
				});
				break;
			}
		});
	});
}

var saveUserOptions = function(uid, options) {
	return new Promise((resolve, reject) => {
		getUserData(uid).then(function(userData){
			var nameChange = '', pwChange = '', emailChange = '';
			var result = {};
			if ('username' in options && options.username != userData.username) {
				result.username = options.username;
				nameChange = ", username = '" + options.username + "'";
			}
			if ('new_password' in options && options.new_password != userData.password) {
				result.password = options.new_password;
				pwChange = ", password = '" + options.new_password + "'";
			}
			if ('email' in options && options.email != userData.email) {
				result.email = options.email;
				emailChange = ", email = '" + options.email + "'";
			}
			var updateUserSql = "UPDATE user set id = "+uid+pwChange+emailChange+nameChange+" where id = "+uid;
			db.run(updateUserSql, [], function(userError) {
				if (userError) {
					reject(userError);
				}
				for (var optionKey in ['random_available','invite_available']) {
					if (optionKey in options && options[optionKey] != userData[option_key]) {
						result[optionKey] = options[optionKey];
						var updateSql = "UPDATE user_options set option_value = ? where option_name = ? and user_id = ?";
						db.run(updateSql,[options[optionKey],optionKey,uid],function(error){
							if (error) {
								reject(error);
							}
						});
					}
				}
				resolve(result);
			});
		});
	});
}

restapi.get('/users', function(req, res){
	var users = {};
	db.each(`
		SELECT id, username FROM user
	`,
	    function (err, row) {
	        if (err) return err;
			users[row.username] = row;
	    },
	    function (err, cntx) {
	        if (err) return err;
			res.json(users);
	    }
	);
});

restapi.post('/login', function(req, res) {
	var query = "SELECT id, userKey FROM `user` WHERE username = '" + req.body.username + "' and password = '" + req.body.password + "'";
	db.get(query, function(err, row){
		if (!row) {
			var userQuery = "SELECT id FROM `user` WHERE username = '" + req.body.username + "'";
			db.get(userQuery, function(userErr, userRow) {
				var rv = {};
				if (!!userRow) {
					rv.error = 'wrong-password';
				}
				else {
					rv.error = 'no-user';
				}
				res.status(401).json(rv);
			});
		}
		else {
			getUserData(row['id']).then(function(user){
				user.user_id = user.id;
				delete user.id;
				res.status(200).json(user);
			});
		}
	});
});

restapi.post('/register', function(req, res) {
	var uName = req.body.username;
	var uPass = req.body.password;
	var uEmail = req.body.email;
	var query = "SELECT id FROM `user` WHERE username = '" + uName + "'";
	db.get(query, function(err, row){
		if (row) {
			var rv = { error: 'username-taken' };
			res.status(401).json(rv);
		}
		else {
			var emailQuery = "SELECT id FROM `user` WHERE email = '" + uEmail + "'";
			db.get(emailQuery, function(emailErr, emailRow) {
				var rv = {};
				if (!!emailRow) {
					rv.error = 'email-taken';
					res.status(401).json(rv);
				}
				else {
					var uKey = randomString(32)
					var now_ts = Date.now() / 1000;
					var insertSql = "INSERT INTO `user` (username,email,password,userKey,join_date,last_active) VALUES ";
					insertSql += "('"+uName+"','"+uEmail+"','"+uPass+"','"+uKey+"','"+parseInt(now_ts)+"','"+parseInt(now_ts)+"')";
				}
				db.run(insertSql, [], function(error) {
					if (error) {
						res.status(401).json({ 'error': error });
					}
					else {
						getUserData(this.lastID).then(function(userData){
							res.status(200).json(userData);
						},
						function(err) {
							res.status(401).json({ 'error': err });
						});
					}
				});
			});
		}
	});
});

restapi.post('/game', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			getGameData(req.body.id,uid).then(function(result) {
				result.id = req.body.id;
				res.json(result);
				markOpenGameViewed(uid,req.body.id);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/new_game', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			var opponentId = req.body.opponent_id || null;
			var gameId = req.body.game_id || null;
			var actionMode = req.body.mode;
			if (actionMode == 'random' || actionMode == 'join') {
				joinGame(actionMode, uid, gameId).then(function(result){
					res.status(200).json(result);
					if (result.joined) {
						addNotification({
							text: '[%username] has joined your open game!',
							user_id: result.joined.starter_uid,
							category: 'open-joined',
							additional: {
								game_id: result.joined.id,
								link_type: 'game',
								username: result.joined.opponent_name,
								user_id: result.joined.opponent_uid
							}
						}).then(function() {
							// success!
						}, function(err) {
							// what!
							console.log('add notification error',err);
						});
					}
				});
			} else {
				newGame(uid, opponentId).then(function(result){
					res.status(200).json(result);
					if (result.created) {
						addNotification({
							text: '[%username] has invited you to a game!',
							user_id: result.created.opponent_uid,
							category: 'invite-sent',
							additional: {
								game_id: result.created.id,
								link_type: 'game',
								username: result.created.starter_name,
								user_id: result.created.starter_uid
							}
						}).then(function() {
							// success!
						}, function(err) {
							// what!
							console.log('add notification error',err);
						});
					}
				});
			}
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/opponent_status', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			var gameId = req.body.game_id;
			getOpponentData(gameId,uid).then(function(result){
				deleteAcceptNotice(uid, req.body.game_id);
				res.status(200).json(result);
			},function(err) {
				res.status(401).json({ error: err });
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/save_user_options', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			var gameId = req.body.game_id;
			saveUserOptions(uid,req.body).then(function(result){
				res.status(200).json(result);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/join_game', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			var gameId = req.body.game_id;
			joinGame('join',uid,gameId).then(function(result){
				res.status(200).json(result);
				if (result.joined) {
					addNotification({
						text: '[%username] has joined your open game!',
						user_id: result.joined.starter_uid,
						category: 'open-joined',
						additional: {
							game_id: result.joined.id,
							link_type: 'game',
							username: result.joined.opponent_name,
							user_id: result.joined.opponent_uid
						}
					}).then(function() {
						// success!
					}, function(err) {
						// what!
						console.log('add notification error',err);
					});
				}
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/cancel_request', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		cancelRequest(uid,req.body.game_id).then(function(result) {
			res.status(200).json(result);
		},function(err) {
			res.status(401).json({ error: err });
		});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/decline_invite', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		declineInvite(uid,req.body.game_id).then(function(result) {
			if (result.declined) {
				addNotification({
					text: '[%username] has declined your game invite.',
					user_id: result.declined.starter_uid,
					category: 'invite-declined',
					additional: {
						game_id: result.declined.id,
						link_type: 'game',
						username: result.declined.opponent_name,
						user_id: result.declined.opponent_uid
					}
				}).then(function() {
					deleteInvite(req.body.game_id);
				}, function(err) {
					// what!
					console.log('add notification error',err);
				});
			}
			res.status(200).json(result);
		},function(err) {
			res.status(401).json({ error: err });
		});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/accept_invite', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		acceptInvite(uid,req.body.game_id).then(function(result) {
			if (result.accepted) {
				addNotification({
					text: '[%username] has accepted your game invite!',
					user_id: result.accepted.starter_uid,
					category: 'invite-accepted',
					additional: {
						game_id: result.accepted.id,
						link_type: 'game',
						username: result.accepted.opponent_name,
						user_id: result.accepted.opponent_uid
					}
				}).then(function() {
					deleteInvite(req.body.game_id);
				}, function(err) {
					// what!
					console.log('add notification error',err);
				});
			}
			res.status(200).json(result);
		},function(err) {
			res.status(401).json({ error: err });
		});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/past_opponents', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			getPastOpponents(uid).then(function(result){
				res.status(200).json(result);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/user_profile', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			getUserProfile(req.body.profile_uid,uid).then(function(result){
				res.status(200).json(result);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/headtohead', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			getHeadToHead(uid, req.body.opponent_uid).then(function(result){
				res.status(200).json(result);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/open_games', function(req, res) {
	checkCreds(req.body).then(
		function(uid) {
			var query = "SELECT DISTINCT g.id, g.title, u.username FROM game g INNER JOIN user u ON u.id = g.starting_user_id WHERE u.id <> '" + uid+ "' AND g.opponent_user_id IS NULL";
			db.all(query, [], (err, rows) => {
				if (err) {
					throw err;
				}
				var rv = {};
				for (var i in rows) {
					var row = rows[i];
					rv[row.id] = { title: row.title, username: row.username };
				}
				res.json(rv);
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/games', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		getRecentGames(uid).then(function(recentGames) {
			var query = "SELECT g.id, g.title, g.starting_user_id as starter_uid, su.username as starter_name, g.opponent_user_id as opponent_uid, ou.username as opponent_name, g.started, g.turn, g.last_move_ts, g.status FROM `game` g INNER JOIN `user` su ON su.id = g.starting_user_id LEFT JOIN `user` ou ON ou.id = g.opponent_user_id WHERE g.status IN ('active','open') AND (starting_user_id = '" + uid+ "' OR opponent_user_id = '" + uid+ "') ORDER BY g.started DESC, g.last_move_ts DESC";
			db.all(query, [], (err, rows) => {
				if (err) {
					throw err;
				}
				var activeGames = rows;
				res.json({ recent: recentGames, active: activeGames });
			});
		},
		function(err) {
			res.status(401).json({ error: err });
		})
	});
});

restapi.post('/notifications', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		var ctQuery = "select count(id) as total, count(seen_ts) as seen from notification where user_id = " + uid;
		db.get(ctQuery, [], function(error, row) {
			if (row.total) {
				var unseen = row.total - row.seen;
				var query = "select id, text, category, added_ts, seen_ts, additional from notification where user_id = " + uid + " order by added_ts DESC LIMIT 8";
				db.all(query, [], (err, rows) => {
					if (err) {
						throw err;
					}
					var newest_ts = rows.length ? rows[0].added_ts : Date.now();
					res.status(200).json({ notifications: rows, total: row.total, unseen: unseen, newest_ts: newest_ts });
				});
			}
			else {
				res.status(200).json({ notifications: [], total: 0, unseen: 0, newest_ts: Date.now() });
			}
		});
	});
});

restapi.post('/markSeen', function(req, res) {
	checkCreds(req.body).then(
		function(uid){
			var notification_ids = req.body.notification_ids;
			if (!notification_ids) {
				return;
			}
			markSeen(uid, notification_ids).then(function(result) {
				res.status(200).json(result);
			});
		}
	);
});

restapi.post('/incoming_invites', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		getIncomingInvites(uid).then(function(gameList) {
			res.status(200).json(gameList);
		},function(err) {
			res.status(401).json({ error: err });
		});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/outgoing_requests', function(req, res) {
	checkCreds(req.body).then(function(uid) {
		getOutgoingRequests(uid).then(function(gameList) {
			res.status(200).json(gameList);
		},function(err) {
			res.status(401).json({ error: err });
		});
		},
		function(err) {
			res.status(401).json({ error: err });
		}
	);
});

restapi.post('/saveGame', function(req, res) {
	checkCreds(req.body).then(
		function(uid){
			var gameId = req.body.game_id;
			if (req.body.moveData) {
				getGameData(gameId, false).then(function(gameData){
					updateLastMove(gameId, req.body.moveData).then(function(rv) {
						var spaces = JSON.parse(gameData.spaces);
						var moveData = JSON.parse(req.body.moveData);
						var movedSpace = cloneDeep(spaces[moveData.from]);
						movedSpace.id = moveData.to;
						delete spaces[moveData.from];
						spaces[moveData.to] = movedSpace;
						gameData.spaces = JSON.stringify(spaces);
						gameData.players = req.body.players;
						gameData.captured = req.body.captured;
						gameData.sender = uid;
						gameData.turn = req.body.turn;
						saveGameData(gameData).then(function(gid) {
							res.status(200).json({ id: gameId });
						});
					});
				});
			}
			else {
				var gameData = {
					spaces: req.body.spaces,
					players: req.body.players,
					captured: req.body.captured,
					started: req.body.started,
					id: gameId,
					sender: uid,
					turn: req.body.turn || null
				};
				saveGameData(gameData).then(function(gid) {
					res.status(200).json({ id: gameId });
				});
			}
		}
	);
});

restapi.post('/usernames',function(req, res){
	checkCreds(req.body).then(
		function(uid) {
			getUserList(uid).then(function(userList){
				var statusCode =  !!userList.error ? 403 : 200;
				res.status(statusCode).json(userList);
			});
		}
	);
});

restapi.get('/config',function(req, res){
	res.status(200).json(Config);
});

restapi.post('/battle', function(req, res) {
	checkCreds(req.body).then(
		function(uid){
			var gameId = req.body.game_id;
			getBattleResult({
				uid: uid,
				space_id: req.body.space_id,
				from_id: req.body.from_space_id,
				attack_rank: req.body.attack_rank,
				attack_color: req.body.attack_color,
				spaces: req.body.spaces,
				attacker_id: uid,
				game_id: gameId
			}).then(function(result){
				res.status(200).json(result);
			},
			function(err){
				res.status(401).json({ error: err });
			});
		}
	);
});

var listenPort = 3000;
restapi.listen(listenPort);

console.log("Game server running on port "+listenPort+".");
