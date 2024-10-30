var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const sql = {
      sql:"select distinct q.question_name,g.qualification_name,g.question_genre,g.question_years from question_table q JOIN genre_table g ON q.question_id = g.question_id;"
    }
    var result = await SQL_exec2(sql);
    var data = {
      name:req.session.user.username,
      web:result1
    }
    res.render('mondai2',data);
  }catch(error){
    console.log(error);
  }
});
 
  /*pool.getConnection(function(err,connection){
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
    })*/


module.exports = router;