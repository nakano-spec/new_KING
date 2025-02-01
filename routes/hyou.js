var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
/* GET users listing. */

router.get('/',async function(req,res,next){
    if(!req.session.user){
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }else{
        const user_ID = req.query.user_ID;
        const user_name = req.query.user_name;
        const userAnswer = req.query.userAnswer;
        console.log(user_ID,user_name,userAnswer);
        res.render('hyouji3', {user_ID:user_ID,user_name:user_name,userAnswer:userAnswer});
    }
})

module.exports = router;