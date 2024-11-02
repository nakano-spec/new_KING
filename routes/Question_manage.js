const express = require('express');
const router = express.Router();
const { SQL_exec2 } = require('../db/SQL_module');

router.get('/',async function(req,res){
    try{
         var SQL_data ={
            sql:"SELECT g.qualification_name,g.question_genre,g.question_years,q.question_name,q.question_text,COALESCE(s.select_1, '') AS select_1,COALESCE(s.select_2, '') AS select_2,COALESCE(s.select_3, '') AS select_3,COALESCE(s.select_4, '') AS select_4,a.type_name,CASE  WHEN q.picture_flag = 0 THEN '' ELSE p.pics_name END AS pics_name FROM question_table q LEFT JOIN select_table s ON q.question_ID = s.question_ID LEFT JOIN pics_table p ON q.question_ID = p.question_ID JOIN answer_type a ON q.type_ID = a.type_ID JOIN genre_table g ON q.question_ID = g.question_ID;"
        }
        var results = await SQL_exec2(SQL_data)
        res.render('Question_manage', { questions: results });
    }catch(error){
        console.log(error);
    }
})

/*router.get('/', (req, res) => {
    var app = req.app;
    var QuestionSql = "SELECT g.qualification_name,g.question_genre,g.question_years,q.question_name,q.question_text,COALESCE(s.select_1, '') AS select_1,COALESCE(s.select_2, '') AS select_2,COALESCE(s.select_3, '') AS select_3,COALESCE(s.select_4, '') AS select_4,a.type_name,CASE  WHEN q.picture_flag = 0 THEN '' ELSE p.pics_name END AS pics_name FROM question_table q LEFT JOIN select_table s ON q.question_ID = s.question_ID LEFT JOIN pics_table p ON q.question_ID = p.question_ID JOIN answer_type a ON q.type_ID = a.type_ID JOIN genre_table g ON q.question_ID = g.question_ID;";
    var poolCluster = app.get('pool');
    var pool = poolCluster.of('MASTER');
    if(!req.session.user){
            res.render('login.ejs');
      }else{
        pool.getConnection(function(err1, connection) {
            if (err1) {
                console.error("DB connection error:", err1);
                res.status(500).send("Database connection error");
                connection.release();
                return;
            }

            //表示
            connection.query(QuestionSql,(err2, results) => {

                if (err2) {
                    console.error("Query error:", err2);
                    res.status(500).send("Database query error");
                    connection.release();
                    return;
                }
                console.log(results);
                // クエリの結果をビューに渡す
                res.render('Question_manage', { questions: results });
                connection.release();
            });
            

            router.post('/delete', (req, res) => {
                var app = req.app;
                var pool = app.get('pool2').of('MASTER');
                var selectedQuestions = req.body.selectedQuestions;
            
                if (!selectedQuestions) {
                    return res.redirect('/Question_manage'); // 選択された問題がない場合
                }
                if (typeof selectedQuestions === 'string') {
                    selectedQuestions = [selectedQuestions]; // 単一選択の場合、配列に変換
                }
            
                var deleteSql = 'DELETE FROM question_table WHERE question_name IN (?);';
                /*var QuestionDelete = 'DELETE FROM question_table WHERE question_name = selectedQuestions;';
                pool.query(deleteSql, [selectedQuestions], (err3) => {
                    if (err3) {
                        console.error("Delete query error:", err3);
                        return res.status(500).send('Database delete query error');
                    }
                    res.redirect('/Question_manage'); // 削除後に元のページにリダイレクト
                });
                var deleteRelatedSql = 'DELETE FROM correct_table WHERE question_ID IN (SELECT question_ID FROM question_table WHERE question_name IN (?));';
                pool.query(deleteRelatedSql, [selectedQuestions], (err) => {
                    if (err) {
                        // エラー処理
                        return;
                    }
                    // 続いて question_table から削除
                    pool.query(deleteSql, [selectedQuestions], (err) => {
                        // 削除処理の続き
                    });
                });
            });
            
            connection.release(); // コネクションをリリース
        });
        }
});*/


module.exports = router;