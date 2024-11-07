const express = require('express');
const mysql = require('mysql');
const router = express.Router();
var store = require('store');
const async = require('async');

router.get('/', async function(req, res, next) {
    var SQL_data = {
        sql:"select user_name from user_table where user_type = 2"
  }
  var teacher_name = await SQL_exec2(SQL_data);
  res.render('login.ejs',teacher_name);
});
  
module.exports = router;