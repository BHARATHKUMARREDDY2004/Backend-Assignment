"use strict";

var Promise = require("bluebird");
var mysql = require("mysql");
var logger = require("../utils/logger");
var Connection = require("mysql/lib/Connection");

var pool = mysql.createPool({
    ConnectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "Bharath@2004",
    database: "sample"
});

Promise.promisifyAll(pool);
var db = pool;

db.getConnectionAsync()
    .then(function(connection){
        logger.info("Success, Database Connected..!");
        connection.release();
    })
    .catch(function(err){
        logger.error("Database Connection Failed." + err.message);
    })

const UsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

db.queryAsync(UsersTable);

module.exports = db;