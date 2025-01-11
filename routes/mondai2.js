var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

/* GET users listing. */

router.get('/',async function(req,res){
  try{
    const { room_ID, question_ID, limit_time } = req.query;
    var data1={
      room_ID,room_ID,
      question_ID:question_ID,
      second:limit_time,
      name:req.session.user.username
    }
    res.render('mondai3.ejs',data1);
  }catch(err){
    console.log(err);
  }
})

module.exports = router;