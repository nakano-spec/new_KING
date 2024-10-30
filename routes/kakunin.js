var express = require('express');
var router = express.Router();
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

router.get('/', async function(req, res, next) {
    try{
        var qualificationdata = req.query.qualificationName;
        var year = req.query.year;
        var question = req.query.questionName;
        var genre = req.query.genre;
        var data = {
            sql:"select q.question_text,o.question_optional,c.answer from question_table q,correct_table c,optional_table o where question_name = ? and q.question_ID = o.question_ID and q.question_ID = c.question_ID;",
            value:[question]
        }
        var question_data = await SQL_exec(data);
        var options = question_data.map(row => row.question_optional);
        //データをまとめて１つのオブジェクト化
        var dataset = {
            qualification:qualificationdata,
            Year:year,
            question_name:question,
            genre:genre,
            results:result,
            optional:options
        }
        res.render('kakunin.ejs',dataset);
    }catch(error){
        console.log(error)
    }
    
   /*pool.getConnection(function(err,connection){
   //
    
    //SQLを実行する。errorだった場合はerrに、SQL結果をresultに配列形式で入る。
    connection.query(sql4,[question],(err,result,fields) =>{
        //errorだった場合はエラーを表示する。
        if(err){
            console.log(err);
        }
        //

        //データをまとめて１つのオブジェクト化
        var dataset = {
            qualification:qualificationdata,
            Year:year,
            question_name:question,
            genre:genre,
            results:result
        }
        //
        console.log(dataset);
        //res.renderで指定した画面を表示する。後ろにデータまたは変数を書くことでデータも遅れる。
        res.render('kakunin.ejs',dataset);
        connection.release();
    })
   //
   })*/
});

module.exports = router;