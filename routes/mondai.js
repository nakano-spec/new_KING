var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const async = require('async');
const { SQL_exec2 } = require('../db/SQL_module');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const sql = {
      sql:"select distinct question_name,qualification_name,question_genre,question_years from (select q.question_name,g.qualification_name,g.question_genre,g.question_years from question_table q JOIN genre_table g ON q.question_id = g.question_id) AS subquery;"
    }
    var result = await SQL_exec2(sql);
    var data = {
      name:req.session.user.username,
      web:result
    }
    res.render('mondai2',data);
  }catch(error){
    console.log(error);
    const err = new Error('セッションが切れています。ログインしてください。');
    err.status = 401; // HTTPステータスコード 401 (Unauthorized)
    return next(err); // 次のエラーハンドリングミドルウェアに渡す
  }
});
 
module.exports = router;