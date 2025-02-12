var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');

/* GET home page. */
router.get('/', function(req, res,next) {
    if(!req.session.user){
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }else{
    res.render('main',{name:req.session.user.username});
  }
});


module.exports = router;