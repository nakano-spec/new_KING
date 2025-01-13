var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res,next)=> {
    if(!req.session.user){
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
      }else{
        res.render('question_additionMethod',{username:req.session.user.username});
      }
});

module.exports = router;