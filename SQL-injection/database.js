const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'p@ssword123')");
  db.run("INSERT INTO users VALUES (2, 'guest', 'guest456')");
});

module.exports = db;