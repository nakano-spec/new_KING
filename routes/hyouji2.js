const express = require("express");
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');
/* GET users listing. */

router.get('/',async function(req,res){
    try{
      // クエリパラメータを受け取る
        const username = req.query.username;
        const tableData = JSON.parse(decodeURIComponent(req.query.tableData));
        res.render('hyouji4',{username,han1:tableData});
    }catch(err){
        console.log(err);
        res.render('hyouji2');
    }
})

/*
router.get('/', function(req, res, next) {
   var app = req.app;
   var poolCluster = app.get("pool");
   var pool = poolCluster.of('MASTER');
   if(!req.session.user){
        res.render('login.ejs');
  }else{
        var username = req.query.username;
        console.log(username);
        var sql = 'select room_ID from room_table where user_ID =?;'
        pool.getConnection(function(err,connection){
            if(err){
                console.log(err);
                connection.release();
            }
            async.waterfall([
                function(callback){
                    connection.query(sql,[username],(err,result,field)=>{
                    if(err){
                        console.log(err);
                        connection.release();
                    }
                    callback(null,username,result[0].room_ID);
                    }) 
                },
                function(username,roomID,callback){ 
                    var sql2 = "select question_ID from question_log where room_ID = ? and question_status = 1;";
                    connection.query(sql2,roomID,(err,result2,field)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        callback(null,username,roomID,result2[0].question_ID);
                    })
                },
                function(username,roomID,questionID,callback){
                    console.log(roomID,questionID);
                    var sql3 = "select distinct a.user_ID,u.user_name,a.answer,a.result from answer_table a,user_table u,question_log q where a.user_ID = u.user_ID and a.question_ID = q.question_ID and q.room_ID = ? and a.question_ID = ?;";
                    connection.query(sql3,[roomID,questionID],(err,result3,field)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        res.render('hyouji4',{han1:result3});
                        connection.release();
                    })
                }
            ],
            function(err){
                res.render('hyouji2');
                connection.release();
            })
        })
  }
});
*/
module.exports = router;