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

module.exports = router;