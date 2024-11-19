var express = require('express');
var router = express.Router();
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */

// 編集ページのルート
router.get('/', async function(req, res, next){
  const questionID = req.query.question_ID;
  try{
    var SQL_data ={
      sql: `
      SELECT 
          g.qualification_name,
          g.question_genre,
          g.question_years,
          q.question_name,
          q.question_text,
          COALESCE(q.pics_name, '') AS pics_name,
          GROUP_CONCAT(o.question_optional ORDER BY o.question_optional SEPARATOR ', ') AS options,
          c.answer
      FROM 
          question_table q
      LEFT JOIN 
          optional_table o ON q.question_ID = o.question_ID
      LEFT JOIN 
          correct_table c ON q.question_ID = c.question_ID
      LEFT JOIN 
          genre_table g ON q.question_ID = g.question_ID
      WHERE
                q.question_ID = ?
      GROUP BY 
          q.question_ID, g.qualification_name, g.question_genre, g.question_years, 
          q.question_name, q.question_text, q.pics_name, c.answer;
      `,
      value:[questionID]
      }
      var results = await SQL_exec(SQL_data)
      res.render('question_additionmanual', { question:results,name:req.session.user.username});
    }catch(error){
      console.error(error);
      res.status(500).send("エラーが発生しました");
    }
});


module.exports = router;