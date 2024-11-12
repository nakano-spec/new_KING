const express = require('express');
const mysql = require('mysql');
const router = express.Router();
var store = require('store');
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');

router.get('/', async function(req, res, next) {
    var SQL_data = {
        sql:"select user_name from user_table where user_type = 2"
  }
  var teacher_name = await SQL_exec2(SQL_data);
  console.log(teacher_name);
  res.render('login.ejs',{teacher_name:teacher_name});
});
  
module.exports = router;