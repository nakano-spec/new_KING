var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');
const { SQL_exec2 } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
    const limit = 9; // 1ページあたりのレコード数
    const page = parseInt(req.query.page) || 1; // 現在のページ番号
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const countQuery =  {
        sql:`
        SELECT COUNT(DISTINCT u.user_ID) AS total
        FROM user_table u
        LEFT JOIN login_log l ON u.user_ID = l.user_ID
        where (u.user_ID LIKE ? OR u.user_name LIKE ? OR u.password LIKE ?) AND 
        l.log_time = (SELECT MAX(log_time) FROM login_log WHERE user_ID = u.user_ID);
        `,
        value:[`%${search}%`,`%${search}%`,`%${search}%`]
    }
    const countRows = await SQL_exec(countQuery);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    var SQL_data = {
      sql:`SELECT u.user_ID, u.user_name, u.password,u.user_type, l.log_time 
          FROM user_table u 
          LEFT JOIN login_log l ON u.user_ID = l.user_ID  
          WHERE (u.user_ID LIKE ? OR u.user_name LIKE ? OR u.password LIKE ?) AND 
          l.log_time = (SELECT MAX(log_time) FROM login_log WHERE user_ID = u.user_ID) limit ? offset ?;`,
      value:[`%${search}%`,`%${search}%`,`%${search}%`,limit,offset]
    }
    var result = await SQL_exec(SQL_data)
    res.render('account_list',{data:result,name:req.session.adminuser.username,currentPage:page,totalPages: totalPages,search: search});
  }catch(error){
    console.log(error);
    const err = new Error('セッションが切れています。ログインしてください。');
    err.status = 401; // HTTPステータスコード 401 (Unauthorized)
    return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }
});

module.exports = router;