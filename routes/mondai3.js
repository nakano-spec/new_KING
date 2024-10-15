const express = require("express");
var router = express.Router();
const mysql = require("mysql");
var async = require("async");

router.get("/",(req,res)=>{
    var app = req.app;
    var poolCluster = app.get("pool");
    var pool = poolCluster.of('MASTER');
    if(!req.session.user){
            res.render('login.ejs');
      }else{
            var name = req.session.user.username;
            pool.getConnection(function(err,connection){
            async.waterfall([
                function(callback){
                    pool.getConnection(function(err,connection) {
                        if(err != null){
                        console.log(err);
                        connection.release();
                        return;
                        }
                        callback(null,connection);
                    })
                },
                function(connection,callback){
                    var sql = 'select room_ID from login_log where user_ID = ?';
                    connection.query(sql,name,(err,result,fields)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        var roomID = result[0].room_ID;
                        callback(null,roomID,connection); 
                    })
                },
                function(roomID,connection,callback){
                    var sql2 = 'select question_ID from question_log where room_ID = ? and question_status = 1;';
                    connection.query(sql2,roomID,(err,result2,fields)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        var question = result2[0].question_ID;
                        callback(null,roomID,question,connection);
                    })
                },
                function(roomID,question,connection,callback){
                    var sql3 = 'select distinct q.question_name,a.user_ID,a.answer as userAnswer,a.result,c.answer as collectAnswer,g.qualification_name,g.question_genre,question_years from question_table q,answer_table a,correct_table c,genre_table g where a.question_ID = c.question_ID and a.question_ID = g.question_ID and a.question_ID = q.question_ID and a.question_ID = ?;';
                    connection.query(sql3,question,(err,result3,fields)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        callback(null,roomID,question,result3,connection);
                    })
                },
                function(roomID,question,result3,connection,callback){
                    var sql4 = 'select user_name from user_table where user_ID = ?;';
                    for(const array of result3){
                        connection.query(sql4,array.user_ID,(err,result4,field)=>{
                            if(err){
                                console.log(err);
                                connection.release();
                            }else if(result3[0].kai_keisiki == "選択"){
                                connection.query(sql4,result3[0].mon_ID,(err,result4,field)=>{
                                if(result4[0].han_keisiki == "手動"){
                                    res.render('mondai5',{web : result});
                                }else if(result4[0].han_keisiki == "自動")
                                res.render("mondai4", { web: result}); //resultの内容をwebって言う変数に格納し直し、mondai4に送る。
                                })
                            }else if(result3[0].kai_keisiki == "入力"){
                                connection.query(sql4,result3[0].mon_ID,(err,result4,field)=>{
                                    if(result4[0].han_keisiki == "手動"){
                                        res.render("mondai5", { web: result});
                                    }else if(result4[0].han_keisiki == "自動"){
                                        res.render("mondai6",{ web: result});
                                    }
                                })
                            }
                            array.user_name = result4[0].user_name
                        })
                    }
                    callback(null,question,result3,connection);
                },
                function(question,result3,connection,callback){
                    console.log(question);
                    var sql5 = 'select t.type_name from question_table q,answer_type t where q.type_ID = t.type_ID and q.question_ID = ?;';
                    connection.query(sql5,question,(err,result5,field)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        var typename = result5[0].type_name
                        callback(null,question,result3,typename,connection);
                    })
                },
                function(question,result3,typename,connection,callback){
                    var sql6 = 'select t.judge_type from judge_table j,judge_type t,question_table q where q.question_ID = j.question_ID and j.judge_ID = t.judge_ID and q.question_ID = ?;';
                    connection.query(sql6,question,(err,result6,fields)=>{
                        if(err){
                            console.log(err);
                            connection.release();
                        }
                        var judgename = result6[0].judge_type;
                        callback(null,result3,typename,judgename);
                    })
                },
                function(result3,typename,judgename,callback){
                    if(typename == "選択" && judgename == "自動"){
                        res.render('mondai4',{web:result3});
                    }else if(typename == "選択" && judgename == "手動"){
                        res.render('mondai5',{web:result3});
                    }else if(typename == "入力" && judgename == "手動"){
                        res.render('mondai5',{web:result3});
                    }else if(typename == "入力" && judgename == "自動"){
                        res.render('mondai6',{web:result3});
                    }else{
                        console.log(err);
                        res.render('mondai3');
                        connection.release();
                    }
                }
            ])
        })
      }
})

module.exports = router;