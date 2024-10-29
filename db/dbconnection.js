const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '172.18.96.162', //'172.18.96.186'
    user: 'connect',
    password: 'K1ng@Oyster',
    database: 'mydb'
})

module.exports = {pool};