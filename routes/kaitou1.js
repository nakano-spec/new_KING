var express = require('express');
var router = express.Router();
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
      var name = req.session.student.username;
      var data ={
        name: name
      }
      res.render('kaitou.ejs',data);
    }catch(error){
      console.log(error);
      const err = new Error('セッションが切れています。ログインしてください。');
      err.status = 401; // HTTPステータスコード 401 (Unauthorized)
      return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }
});

module.exports = router;