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

module.exports = router;