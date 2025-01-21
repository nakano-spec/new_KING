const express = require("express");
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');
/* GET users listing. */

router.get('/', async function (req, res, next) {
    try {
        var name = req.session.user.username;
        const limit = 9; // 1ページあたりのレコード数
        const page = parseInt(req.query.page) || 1; // 現在のページ番号
        const offset = (page - 1) * limit;

        // ルームID取得
        var selectSQL = {
            sql: 'SELECT room_ID FROM room_table WHERE user_ID = ?',
            value: [name]
        };
        const roomResult = await SQL_exec(selectSQL);
        const room_ID = roomResult[0]?.room_ID;

        // 質問IDとログID取得
        selectSQL.sql = 'SELECT question_ID, q_log_ID FROM question_log WHERE room_ID = ? AND question_status = 1 ORDER BY log_time DESC LIMIT 1';
        selectSQL.value = [room_ID];
        const questionResult = await SQL_exec(selectSQL);
        const question_ID = questionResult[0]?.question_ID;
        const q_log_ID = questionResult[0]?.q_log_ID;

        // 総レコード数を取得
        selectSQL.sql = `
            SELECT COUNT(*) AS total_count
            FROM answer_table AS a
            JOIN question_log AS l ON l.q_log_ID = a.q_log_ID
            JOIN question_table AS q ON l.question_ID = q.question_ID
            WHERE a.q_log_ID = ? AND q.question_ID = ?;
        `;
        selectSQL.value = [q_log_ID, question_ID];
        const totalItemsResult = await SQL_exec(selectSQL);
        const totalItems = totalItemsResult[0]?.total_count || 0;

        // 総ページ数計算
        const totalPages = Math.ceil(totalItems / limit);

        // ページごとのデータを取得
        selectSQL.sql = `
            SELECT 
                a.user_ID,
                u.user_name,
                a.answer AS user_answer,
                a.result
            FROM 
                answer_table AS a
            JOIN 
                question_log AS l ON l.q_log_ID = a.q_log_ID
            JOIN 
                question_table AS q ON l.question_ID = q.question_ID
            JOIN 
                user_table AS u ON a.user_ID = u.user_ID
            WHERE 
                a.q_log_ID = ? AND q.question_ID = ?
            LIMIT ? OFFSET ?;
        `;
        selectSQL.value = [q_log_ID, question_ID, limit, offset];
        const answerData = await SQL_exec(selectSQL);

        // クライアントにレンダリング
        res.render('hyouji4', { 
            name: name, 
            han1: answerData, 
            currentPage: page, 
            totalPages: totalPages 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

    /*try{
      // クエリパラメータを受け取る
        const username = req.query.username;
        res.render('hyouji4',{username,han1:tableData});
    }catch(err){
        console.log(err);
        res.render('hyouji2');
    }*/

module.exports = router;