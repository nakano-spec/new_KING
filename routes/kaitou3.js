var express = require('express');
var router = express.Router();
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
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