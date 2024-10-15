var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  if(!req.session.user){
        res.render('login.ejs');
  }else{
      var name1 = req.session.user.username;
      var data ={
        name:name1
      }
        res.render('hyouji2.ejs',data);
  }
});

module.exports = router;