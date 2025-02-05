var express = require('express');
var router = express.Router();
const { SQL_exec } = require('../db/SQL_module');
const { SQL_exec2 } = require('../db/SQL_module');

// 解答履歴の取得 (ページング対応)
router.get('/', async (req, res, next) => {
    try {
        const limit = 10; // 1ページあたりのレコード数
        const page = parseInt(req.query.page) || 1; // 現在のページ番号
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const username = req.session.user.username
        const room = {
            sql:`select room_ID from room_table where user_ID = ?;`,
            value:[username]
        }
        const room_search = await SQL_exec(room);
        const room_ID = room_search[0].room_ID;

        // 合計レコード数を取得
        const countQuery = {
            sql: `
            SELECT COUNT(*) AS total
            FROM answer_table AS a
            INNER JOIN question_log AS qlog ON a.q_log_ID = qlog.q_log_ID
            INNER JOIN question_table AS q ON qlog.question_ID = q.question_ID
            INNER JOIN room_table AS r ON qlog.room_ID = r.room_ID
            WHERE
                    r.room_ID = ? and
                    (a.user_ID LIKE ? OR
                     q.question_name LIKE ? OR
                     a.answer LIKE ?)
            ;`,
            value:[room_ID,`%${search}%`,`%${search}%`,`%${search}%`]
        };
        const countRows = await SQL_exec(countQuery);
        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);
        

        // ページングされたデータを取得
        const query = {
            sql: `
                SELECT
                        a.user_ID AS student,
                        q.question_name AS question_name,
                        a.answer AS student_answer,
                        a.result AS result,
                        qlog.log_time
                    FROM
                        answer_table AS a
                    INNER JOIN
                        question_log AS qlog ON a.q_log_ID = qlog.q_log_ID
                    INNER JOIN
                        question_table AS q ON qlog.question_ID = q.question_ID
                    INNER JOIN
                        room_table AS r ON qlog.room_ID = r.room_ID
                    WHERE
                        r.room_ID = ? and
                        (a.user_ID LIKE ? OR
                        q.question_name LIKE ? OR
                        a.answer LIKE ?)
                    ORDER BY
                        qlog.log_time DESC
                    LIMIT ? OFFSET ?;`
            ,
            value: [room_ID,`%${search}%`,`%${search}%`,`%${search}%`,limit, offset]
        };

        const result = await SQL_exec(query);

        req.session.limit = limit;
        req.session.offset = offset;
        req.session.save();

        // テンプレートにデータを渡してレンダリング
        res.render("answer_history.ejs", {
            answers: result,
            currentPage: page,
            totalPages: totalPages,
            name:req.session.user.username,
            search: search
        });
    } catch (error) {
        console.error('エラー:', error.message);
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }
});

module.exports = router;
