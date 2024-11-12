var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
const { SQL_exec2 } = require('../db/SQL_module');

router.get("/", async (req,res)=>{
    const sql ={
        sql:"select u.user_ID,u.user_name,l.log_time,u.user_type from user_table u left join login_log l on u.user_ID = l.user_ID;"
    } 
    var result = await SQL_exec2(sql);
    res.render("account", {ac:result}); //resultの内容をacに格納後、accountに飛ばしている。　
})

/*
router.get("/", (req, res)=> {
    const sql = "select u.user_ID,u.user_name,u.log_time,u.user_type from user_table u;"
    var app = req.app;//データベースへのログイン用
    var poolCluster = app.get("pool");
    var pool = poolCluster.of('MASTER');
    if(!req.session.user){
            res.render('login.ejs');
      }else{
        pool.getConnection(function(err,connection){
            if(err){
                console.log(err);
                connection.release();
            }
            connection.query(sql, (err, result, fields)=>{
                if(err){
                    console.log(err);
                    connection.release();
                }
                console.log(result);
                var r1 = result.length;
                    console.log(result);
                    console.log(r1);
                res.render("account", {ac:result}); //resultの内容をacに格納後、accountに飛ばしている。　
            })
        })
      }
});*/

module.exports = router;