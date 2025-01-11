const express = require("express");
var router = express.Router();
const mysql = require("mysql2");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

router.get("/", (req, res)=>{
      var name = req.session.student.username;
      const { room_ID, question_text, options } = req.query;

      // options を配列に戻す
      const optionsArray = JSON.parse(options);
      res.render('kaitou2.ejs',{
            name:name,
            question_text,
            options:optionsArray
      });
})

module.exports = router;
