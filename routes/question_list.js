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
      sql:`
        SELECT 
            g.qualification_name,
            g.question_genre,
            g.question_years,
            q.question_name,
            q.question_text,
            COALESCE(p.pics_name, '') AS pics_name,
            GROUP_CONCAT(o.question_optional ORDER BY o.question_optional SEPARATOR ', ') AS options,
            c.correct
        FROM 
            question_table q
        LEFT JOIN 
            optional_table o ON q.question_ID = o.question_ID
        LEFT JOIN 
            correct_table c ON q.question_ID = c.question_ID
        LEFT JOIN 
            genre_table g ON q.question_ID = g.question_ID
        LEFT JOIN 
            pics_table p ON q.question_ID = p.question_ID
        GROUP BY 
            q.question_ID, g.qualification_name, g.question_genre, g.question_years, 
            q.question_name, q.question_text, p.pics_name, c.correct;
      `
    }
    var result = await SQL_exec2(select_SQL);
    res.render('question_list',{data:result});
  }catch(error){
    console.log(error);
  }
});

module.exports = router;