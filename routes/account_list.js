var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
    var SQL_data = {
      sql:"select u.user_ID,u.user_name,l.log_time from user_table u LEFT JOIN login_log l on u.user_ID = l.user_ID where l.log_time = (select max(log_time) from login_log where user_ID = u.user_ID)"
    }
    var result = await SQL_exec2(SQL_data)
    res.render('account_list',{data:result,name:req.session.user.username});
  }catch(error){
    console.log(error);
  }
 
  /*pool.getConnection(function(err,connection){
    connection.query(sql,(err,result,fields) =>{
        if(err){
            console.log(err);
        }
        res.render('account_list',{data:result});
       })
       connection.release();
   })*/
});

module.exports = router;