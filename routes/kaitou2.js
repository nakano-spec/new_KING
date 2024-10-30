const express = require("express");
var router = express.Router();
const mysql = require("mysql2");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

router.get("/", (req, res)=>{
      var name = req.query.name;
      var SQL_data ={
            sql:"select question_ID from question_log where room_ID = ? and question_status = 1",
            value:[req.session.studentroom_ID]
      }

      var question_result = SQL_exec(SQL_data);
      var question_ID = question_result[0].question_ID;
      SQL_data.sql = "select q.question_text,o.question_optional from question_table q,optional_table o where q.question_ID = o.question_ID and q.question_ID = ?";
      SQL_data.value = [question_ID];
      var result = SQL_exec(SQL_data);
      var data ={
            name:name,
            question_text:result[0].question_text,
            select_1:result[0].select_1,
            select_2:result[0].select_2,
            select_3:result[0].select_3,
            select_4:result[0].select_4
      }
      res.render('kaitou4.ejs',data);
      /*if(!req.session.student){
            res.render('login.ejs');
      }else{
                  
                  pool.getConnection(function(err,connection){
                        if(err){
                              console.log(err);
                              connection.release();
                        }
                  async.waterfall([
                        function(callback){
                              var sql2 = ;
                              connection.query(sql2,[req.session.studentroom_ID],(err,result2,fields)=>{
                                    if(err){
                                          console.log(err);
                                          connection.release();
                                    }
                                    callback(null,result2[0].question_ID);
                              })
                        },
                        function(question_ID,callback){
                              var sql3 = "select a.type_name from answer_type a,question_table q where a.type_ID = q.type_ID and q.question_ID = ?;";
                              connection.query(sql3,[question_ID],(err,result3,fields)=>{
                                    if(err){
                                          console.log(err);
                                          connection.release();
                                    }
                                    callback(null,result3[0].type_name,question_ID);
                              })
                        },
                        function(type_name,question_ID,callback){
                        var flag = 0;
                        if(type_name == "選択"){
                              callback(null,flag,question_ID);
                        }else if(type_name == "入力"){
                              flag = 1;
                              callback(null,flag,question_ID);
                        }else{
                              flag = 2;
                              callback(null,flag,question_ID);
                        } 
                        },
                        function(flag,question_ID,callback){
                              if(flag === 0){
                                    var sql4 = "select q.question_text,s.select_1,s.select_2,s.select_3,s.select_4 from question_table q,select_table s where s.question_ID = q.question_ID and q.question_ID = ?;";
                                    connection.query(sql4,question_ID,(err,result4,fields)=>{
                                          if(err){
                                                console.log(err);
                                                connection.release();
                                          }
                                          var data ={
                                                name:name,
                                                question_text:result4[0].question_text,
                                                select_1:result4[0].select_1,
                                                select_2:result4[0].select_2,
                                                select_3:result4[0].select_3,
                                                select_4:result4[0].select_4
                                          }
                                          res.render('kaitou2.ejs',data);
                                          connection.release();
                                    })
                              }else if(flag === 1){
                                    var sql4 = "select question_text from question_table where question_ID = ?;";
                                    connection.query(sql4,question_ID,(err,result4,fields)=>{
                                          if(err){
                                                console.log(err);
                                                connection.release();
                                          }
                                          var data ={
                                                name:name,
                                                question_text:result4[0].question_text
                                          }
                                          res.render('kaitou4.ejs',data);
                                          connection.release();
                                    })
                              }
                        }
                  ])
                  })
      }*/
})

module.exports = router;
