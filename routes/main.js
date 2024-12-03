var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
    console.log(req.session);
    res.render('main',{name:req.session.user.username});
});


module.exports = router;