const express = require("express");
var router = express.Router();
const mysql = require("mysql");
var async = require("async");
const { SQL_exec } = require('../db/SQL_module');

router.get('/',async function(req,res,next){
    try{
        var name = req.session.user.username;
        const limit = 10; // 1ページあたりのレコード数
        const page = parseInt(req.query.page) || 1; // 現在のページ番号
        const offset = (page - 1) * limit;
        var selectSQL = {
            sql: 'select room_ID from room_table where user_ID = ?',
            value: [name]
        };
        var roomResult = await SQL_exec(selectSQL);
        var room_ID = roomResult[0].room_ID;
        console.log(room_ID);

        selectSQL.sql = 'select question_ID,q_log_ID from question_log where room_ID = ? and question_status = 1 ORDER BY log_time DESC LIMIT 1';
        selectSQL.value = [room_ID];
        var questionResult = await SQL_exec(selectSQL);
        var question_ID = questionResult[0].question_ID;
        var q_log_ID = questionResult[0].q_log_ID;

        // 総レコード数を取得するSQLクエリ
        selectSQL.sql = `
        SELECT COUNT(*) AS total_count
        FROM 
            answer_table AS a
        JOIN 
            question_log AS l 
            ON l.q_log_ID = a.q_log_ID
        JOIN 
            question_table AS q 
            ON l.question_ID = q.question_ID
        WHERE 
            a.q_log_ID = ? 
            AND q.question_ID = ?;
        `;
        selectSQL.value = [q_log_ID,question_ID];

        // 総レコード数を取得
        var data = await SQL_exec(selectSQL);
        const totalItems = data[0].total_count;
        const totalPages = Math.ceil(totalItems / limit);
        console.log(limit,offset)

        selectSQL.sql = `SELECT 
            g.qualification_name,
            g.question_years,
            q.question_name,
            q.question_text,
            a.user_ID,
            u.user_name,
            a.answer AS user_answer,
            CASE 
                WHEN COUNT(DISTINCT c.correct) > 1 THEN GROUP_CONCAT(DISTINCT c.correct ORDER BY c.correct SEPARATOR ', ')
                ELSE MAX(c.correct)
            END AS correct_answers,
            a.result,
            COALESCE(GROUP_CONCAT(DISTINCT o.question_optional ORDER BY o.question_optional SEPARATOR ', '), '') AS options
        FROM 
            answer_table AS a
        JOIN 
            question_log AS l 
            ON l.q_log_ID = a.q_log_ID
        JOIN 
            question_table AS q 
            ON l.question_ID = q.question_ID
        LEFT JOIN 
            optional_table AS o 
            ON q.question_ID = o.question_ID
        LEFT JOIN 
            correct_table AS c 
            ON c.question_ID = q.question_ID
        JOIN 
            genre_table AS g 
            ON q.question_ID = g.question_ID
        JOIN 
            user_table AS u 
            ON a.user_ID = u.user_ID 
        WHERE 
            a.q_log_ID = ? 
            AND q.question_ID = ?
        GROUP BY 
            a.q_log_ID, 
            q.question_ID, 
            g.qualification_name, 
            g.question_years, 
            q.question_name, 
            q.question_text, 
            a.user_ID,
            u.user_name, 
            a.answer, 
            a.result
            limit ? offset ?
            `;
        
        selectSQL.value = [q_log_ID,question_ID,limit,offset];
        var questionData = await SQL_exec(selectSQL);
        console.log(page,totalItems);
        res.render('mondai6', { name:name,web: questionData,currentPage:page,totalPages:totalPages });
    }catch(error){
        console.log(error)
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }
})
module.exports = router;