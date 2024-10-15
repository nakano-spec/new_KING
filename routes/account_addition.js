var express = require('express');
var router = express.Router();
const async = require('async');

const mysql = require("mysql")
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
  if(!req.session.user){
        res.render('login.ejs');
  }else{
    res.render('account_addition.ejs');
  }
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20010426',
    database: 'mydb2'
  });
  //password
  //matosui122083

//このページに来たら最初に行う処理
/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.render('account_addition.ejs');
});*/

module.exports = router;