var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

/* GET users listing. */

router.get('/',async function(req,res,next){
  try{
    const { room_ID, question_ID, limit_time } = req.query;
    var data1={
      room_ID,room_ID,
      question_ID:question_ID,
      second:limit_time,
      name:req.session.user.username
    }
    res.render('mondai3.ejs',data1);
  }catch(error){
    console.log(error);
    const err = new Error('セッションが切れています。ログインしてください。');
    err.status = 401; // HTTPステータスコード 401 (Unauthorized)
    return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }
})

module.exports = router;