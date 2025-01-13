var express = require('express');
var router = express.Router();
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.student){
    const err = new Error('セッションが切れています。ログインしてください。');
    err.status = 401; // HTTPステータスコード 401 (Unauthorized)
    return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }else{
    var name1 = req.session.student.username;
    var data ={
      name: name1
    }
    res.render('kaitou3.ejs',data);
  }
});

module.exports = router;