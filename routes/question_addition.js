var express = require('express');
var router = express.Router();
const async = require('async');

//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.user){
        res.render('login.ejs');
  }else{
    res.render('question_addition.ejs');
  }
});

module.exports = router;