var express = require('express');
var router = express.Router();
const mysql = require("mysql")
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    if(!req.session.user){
            res.render('login.ejs');
      }else{
        res.render('question_additionCSV.ejs');
      }
});


module.exports = router;