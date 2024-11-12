var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
     var name1 = req.query.name;
    var select_SQL = {
      sql:"SELECT g.qualification_name,g.question_genre,g.question_years,q.question_name,q.question_text,COALESCE(s.select_1, '') AS select_1,COALESCE(s.select_2, '') AS select_2,COALESCE(s.select_3, '') AS select_3,COALESCE(s.select_4, '') AS select_4,a.type_name,CASE  WHEN q.picture_flag = 0 THEN '' ELSE p.pics_name END AS pics_name FROM question_table q LEFT JOIN select_table s ON q.question_ID = s.question_ID LEFT JOIN pics_table p ON q.question_ID = p.question_ID JOIN answer_type a ON q.type_ID = a.type_ID JOIN genre_table g ON q.question_ID = g.question_ID;"
    }
    var result = await SQL_exec2(select_SQL);
    res.render('question_list',{data:result});
  }catch(error){
    console.log(error);
  }
});

module.exports = router;