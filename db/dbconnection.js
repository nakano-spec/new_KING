const mysql = require('mysql2');

const pool = mysql.createPool({
    host :'sql307.infinityfree.com',//172.18.96.186,172.18.96.162
    user :'if0_37673553',
    password :'Nakano.0426',
    database :'if0_37673553mydb',
    connectTimeout: 30000 // タイムアウトを30秒に設定
})

module.exports = {pool};