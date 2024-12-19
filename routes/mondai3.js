const express = require("express");
var router = express.Router();
const mysql = require("mysql");
var async = require("async");
const { SQL_exec } = require('../db/SQL_module');

router.get('/',async function(req,res){
    try{
        var name = req.session.user.username;
        const limit = 10; // 1ページあたりのレコード数
        const page = parseInt(req.query.page) || 1; // 現在のページ番号
        const offset = (page - 1) * limit;
        var selectSQL = {
            sql: 'select room_ID from room_table where user_ID = ?',
            value: [name]
        };
        var roomResult = await SQL_exec(selectSQL);
        var room_ID = roomResult[0].room_ID;
        console.log(room_ID);

        selectSQL.sql = 'select question_ID,q_log_ID from question_log where room_ID = ? and question_status = 1 ORDER BY log_time DESC LIMIT 1';
        selectSQL.value = [room_ID];
        var questionResult = await SQL_exec(selectSQL);
        var question_ID = questionResult[0].question_ID;
        var q_log_ID = questionResult[0].q_log_ID;

        // 総レコード数を取得するSQLクエリ
        selectSQL.sql = `
        SELECT COUNT(*) AS total_count
        FROM 
            answer_table AS a
        JOIN 
            question_log AS l 
            ON l.q_log_ID = a.q_log_ID
        JOIN 
            question_table AS q 
            ON l.question_ID = q.question_ID
        WHERE 
            a.q_log_ID = ? 
            AND q.question_ID = ?;
        `;
        selectSQL.value = [q_log_ID,question_ID];

        // 総レコード数を取得
        var data = await SQL_exec(selectSQL);
        const totalItems = data[0].total_count;
        const totalPages = Math.ceil(totalItems / limit);
        console.log(limit,offset)

        selectSQL.sql = `SELECT 
            g.qualification_name,
            g.question_years,
            q.question_name,
            q.question_text,
            a.user_ID,
            u.user_name,
            a.answer AS user_answer,
            CASE 
                WHEN COUNT(DISTINCT c.correct) > 1 THEN GROUP_CONCAT(DISTINCT c.answer ORDER BY c.answer SEPARATOR ', ')
                ELSE MAX(c.correct)
            END AS correct_answers,
            a.result,
            COALESCE(GROUP_CONCAT(DISTINCT o.question_optional ORDER BY o.question_optional SEPARATOR ', '), '') AS options
        FROM 
            answer_table AS a
        JOIN 
            question_log AS l 
            ON l.q_log_ID = a.q_log_ID
        JOIN 
            question_table AS q 
            ON l.question_ID = q.question_ID
        LEFT JOIN 
            optional_table AS o 
            ON q.question_ID = o.question_ID
        LEFT JOIN 
            correct_table AS c 
            ON c.question_ID = q.question_ID
        JOIN 
            genre_table AS g 
            ON q.question_ID = g.question_ID
        JOIN 
            user_table AS u 
            ON a.user_ID = u.user_ID 
        WHERE 
            a.q_log_ID = ? 
            AND q.question_ID = ?
        GROUP BY 
            a.q_log_ID, 
            q.question_ID, 
            g.qualification_name, 
            g.question_years, 
            q.question_name, 
            q.question_text, 
            a.user_ID,
            u.user_name, 
            a.answer, 
            a.result
            limit ? offset ?
            `;
        
        selectSQL.value = [q_log_ID,question_ID,limit,offset];
        var questionData = await SQL_exec(selectSQL);
        console.log(page,totalItems);
        res.render('mondai6', { name:name,web: questionData,currentPage:page,totalPages:totalPages });
    }catch(error){
        console.log(error)
    }
})
/*
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
*/
module.exports = router;