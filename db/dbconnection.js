const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.168.0.16', //,172.18.96.186,172.18.96.162
    user: 'connect',
    password: 'K1ng@Oyster',
    database: 'mydb',
    connectTimeout: 30000 // タイムアウトを30秒に設定
})

module.exports = {pool};