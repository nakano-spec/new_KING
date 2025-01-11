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
            sql:"select q.question_text,o.question_optional,c.correct from question_table q,correct_table c,optional_table o where question_name = ? and q.question_ID = o.question_ID and q.question_ID = c.question_ID;",
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
});

module.exports = router;