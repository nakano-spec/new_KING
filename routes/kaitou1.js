var express = require('express');
var router = express.Router();
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
      var name = req.session.student.username;
      var data ={
        name: name
      }
      res.render('kaitou.ejs',data);
    }catch(err){
      console.log(err);
    }
});

module.exports = router;