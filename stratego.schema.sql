BEGIN TRANSACTION;
DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"username"	TEXT UNIQUE,
	"password"	TEXT,
	"email"	TEXT UNIQUE,
	"userKey"	TEXT UNIQUE
);
DROP TABLE IF EXISTS "game";
CREATE TABLE IF NOT EXISTS "game" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"title"	TEXT NOT NULL DEFAULT 'Untitled',
	"starting_user_id"	INTEGER NOT NULL,
	"opponent_user_id"	INTEGER NOT NULL,
	"spaces"	BLOB NOT NULL DEFAULT '[]',
	"captured"	BLOB NOT NULL DEFAULT '[]',
	"starter_ready"	INTEGER NOT NULL DEFAULT 0,
	"opponent_ready"	INTEGER NOT NULL DEFAULT 0,
	"status"	TEXT NOT NULL DEFAULT 'pending'
);
COMMIT;
