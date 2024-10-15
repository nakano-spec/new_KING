var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var name1 = req.query.name;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  var sql = "select user_ID,user_name,password,log_time from user_table;";
  pool.getConnection(function(err,connection){
    connection.query(sql,(err,result,fields) =>{
        if(err){
            console.log(err);
        }
        res.render('account_list',{data:result});
       })
       connection.release();
   })
});

module.exports = router;