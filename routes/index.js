var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');


/* GET home page. */
router.get('/',function(req, res, next) {
      res.render('login.ejs');
});

module.exports = router;
