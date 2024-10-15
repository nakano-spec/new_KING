var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */

//画面遷移してきたらrouter.get内の処理が読み込まれる。
router.get('/', function(req, res, next) {

    var qualificationdata = req.query.qualificationName; // パラメータ名を修正
    var year = req.query.year;
    var question = req.query.questionName; // パラメータ名を修正
    var genre = req.query.genre;

　　//app.jsの読み込み
   var app = req.app;
   //

   //データベース情報を読み込み
   var poolCluster = app.get("pool");
   var pool = poolCluster.of('MASTER')
   //

   //データベースから問題文,選択肢１〜４、答えを取得するSQL
   var sql4 = "select q.question_text,s.select_1,s.select_2,s.select_3,s.select_4,c.answer from question_table q,correct_table c,select_table s where question_name = ? and q.question_ID = s.question_ID and q.question_ID = c.question_ID;"
   //

   //設定されたデータベース情報からデータベースサーバーに接続する。
   pool.getConnection(function(err,connection){
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
   })
});

module.exports = router;