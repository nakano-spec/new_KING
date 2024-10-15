var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  //const sql = "select question_name from question_table;"  //リスト表示用SQL
  const sql = "select distinct q.question_name,g.qualification_name,g.question_genre,g.question_years from question_table q JOIN genre_table g ON q.question_id = g.question_id;"
  const poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  console.log(req.session.page);
  console.log(req.session.Before_page);
  if(!req.session.user){
        res.render('login.ejs');
  }else{
      pool.getConnection(function(err,connection){
        if(err != null){
          console.log(err);
          connection.release();
          return;
        }
        pool.query(sql,(err,result1,field)=>{
          if(err){
            console.log(err);
            connection.release();
          }
          var data = {
            name:req.session.user.username,
            web:result1
          }
          res.render('mondai2',data);
          connection.release();
        });
      })
  }
});


module.exports = router;