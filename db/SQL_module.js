var { pool } = require('./dbconnection');

//SQLを実行するモジュール
//書き換えたバージョン　負荷テスト的にこちらの書き方がいい
async function SQL_exec(data) {
  return new Promise((resolve, reject) => {
    console.log("SQL開始")
    pool.query(data.sql, data.value, (err, result) => {
      if (err) {
        console.error('Database query failed:', err);
        return reject(new Error('データベースクエリに失敗しました'));
      }
      console.log(result);
      resolve(result);
    });
  });
}

async function SQL_exec2(data) {
  return new Promise((resolve, reject) => {
    console.log("SQL開始")
    pool.query(data.sql,(err, result) => {
      if (err) {
        console.error('Database query failed:', err);
        return reject(new Error('データベースクエリに失敗しました'));
      }
      console.log(result);
      resolve(result);
    });
  });
}

module.exports = { SQL_exec,SQL_exec2 };