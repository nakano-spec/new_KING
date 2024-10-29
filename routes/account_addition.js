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

module.exports = router;