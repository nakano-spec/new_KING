var express = require('express');
var router = express.Router();
const mysql = require("mysql")
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');
async function SQL_moduletest(){
        var data ={
        sql: 'select * from question_table where question_ID = ?',
        value: [1]
    }
    console.log("テスト開始します")
    const result = await SQL_exec(data); // SQL_execを呼び出す
    console.log(result);
}

SQL_moduletest();
