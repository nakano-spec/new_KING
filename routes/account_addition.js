var express = require('express');
var router = express.Router();
const async = require('async');
const mysql = require("mysql")


//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res,next)=> {
    if(!req.session.adminuser){
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }else{
         res.render('account_addition.ejs',{name:req.session.adminuser.username});
    }
});

module.exports = router;