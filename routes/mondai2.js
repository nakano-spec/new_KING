var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

/* GET users listing. */

router.get('/',async function(req,res){
  try{
    var second = req.query.byou;
    second = Math.abs(second);
    var SQL_data ={
      sql:"UPDATE question_log SET limit_time  = ? WHERE question_status = 1 AND room_ID = 1",
      value:[second]
    }
    var result = await SQL_exec(SQL_data);
    var data1={
      second:parseInt(second),
      name:req.query.name
    }
    res.render('mondai3.ejs',data1);
  }catch(err){
    console.log(err);
  }
})
/*
router.get('/', function(req, res, next) {
  var by = req.query.byou;
  by = Math.abs(by);
  var app = req.app;
  var poolCluster = app.get("pool");
  var pool = poolCluster.of('MASTER');
      const set_time = "UPDATE question_log SET limit_time  = ? WHERE question_status = 1 AND room_ID = 1;"
      var second1 = parseInt(by);
      var name1 = req.query.name;
      pool.getConnection(function(err,connection) {
        if(err != null){
          console.log("DB接続" + err);
          return;
        }
        connection.query(set_time,[by],(err,result,fields) =>{
          if(err){
            console.log("時間" + err);
            connection.release();
          }
          connection.commit((err) =>{
            if(err){connection.rollback(() =>{throw console.log('error');});}
          })
        })
        console.log("追加しました。");
        connection.release();
      })
      var data1={
        byou1:by
      }
      var data1={
        second:second1,
        name:name1
      }
        res.render('mondai3.ejs',data1);
}); 
*/
module.exports = router;