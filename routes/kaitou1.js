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
    /*pool.getConnection(function(err,connection){
      if(err){
        console.log(err);
        connection.release();
            }
            connection.query(sql,name1,(err,result,field)=>{
              if(err){
                console.log(err);
                connection.release();
              }
              var data ={
                name: result[0].user_ID 
              }
              res.render('kaitou.ejs',data);
              connection.release();
            })
          })*/
});

module.exports = router;