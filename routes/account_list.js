var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var name1 = req.query.name;

  var SQL_data = {
    sql:"select user_ID,user_name,password,log_time from user_table"
  }
  var result = SQL_exec2(SQL_data)
  res.render('account_list',{data:result});
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