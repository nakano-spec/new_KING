var express = require('express');
var router = express.Router();
const mysql = require("mysql")
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    if(!req.session.user){
            res.render('login.ejs');
      }else{
        var user_ID = req.query.userId;
        var app = req.app;
        var poolCluster = app.get('pool');
        var pool = poolCluster.of('MASTER');
        var sql = 'select user_name,password from user_table where user_ID = ?;'
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
});


module.exports = router;