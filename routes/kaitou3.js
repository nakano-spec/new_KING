var express = require('express');
var router = express.Router();
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //app.jsの読み込み
  var app = req.app;
  //

  //データベース情報を読み込み
  var poolCluster = app.get("pool");
  var pool = poolCluster.of('MASTER')
  //
  if(!req.session.student){
        res.render('login.ejs');
  }else{
    var name1 = req.query.name;
    var data ={
      name: name1
    }
    res.render('kaitou3.ejs',data);
  }
});

module.exports = router;