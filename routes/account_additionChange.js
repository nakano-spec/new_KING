var express = require('express');
var router = express.Router();
const mysql = require("mysql")
const async = require('async');
//SQLモジュール呼び出し
const { SQL_exec } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", async (req,res,next) =>{
  try{
    var user_ID = req.query.userId;
    const sql_data = {
      sql:'select user_name,password from user_table where user_ID = ?',
      value:[user_ID]
    }
    console.log(sql_data);
    const result = await SQL_exec(sql_data); // SQL_execを呼び出す
    var data = {
      user_ID:user_ID,
      user_name:result[0].user_name,
      password:result[0].password
    }
    res.render('account_additionChange.ejs',data);
  }
  catch(error){
    console.log(error);
    const err = new Error('セッションが切れています。ログインしてください。');
    err.status = 401; // HTTPステータスコード 401 (Unauthorized)
    return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }
})

/*router.get("/", async (req, res)=> {
    if(!req.session.user){
            res.render('login.ejs');
      }else{
        var user_ID = req.query.userId;
        //var app = req.app;
        //var poolCluster = app.get('pool');
        //var pool = poolCluster.of('MASTER');
        const sql_data = {
          sql:'select user_name,password from user_table where user_ID = ?;',
          value:[user_ID]
        }
        const result = await SQL_exec2(data); // SQL_exec2を呼び出す
        var data = {
          user_ID:user_ID,
          user_name:result[0].user_name,
          password:result[0].password
        }
        res.render('account_additionChange.ejs',data);
        /*
        pool.getConnection(function(err,connection){
          if(err){
            console.log(err);
            connection.release();
          }
          connection.query(sql,user_ID,(err,result,field)=>{
            if(err){
              console.log(err);
              connection.release();
            }
            var data = {
              user_ID:user_ID,
              user_name:result[0].user_name,
              password:result[0].password
            }
            res.render('account_additionChange.ejs',data);
            connection.release();
          })
        })
      }
});*/


module.exports = router;