const express = require('express');
const router = express.Router();
const { SQL_exec } = require('../db/SQL_module');
const { SQL_exec2 } = require('../db/SQL_module');

router.get('/',async function(req,res,next){
    try{
        const limit = 10; // 1ページあたりのレコード数
        const page = parseInt(req.query.page) || 1; // 現在のページ番号
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        // 総データ数を取得するクエリ
        const countQuery =  {
            sql:`
            SELECT COUNT(DISTINCT q.question_ID) AS total
            FROM question_table q
            LEFT JOIN optional_table o ON q.question_ID = o.question_ID
            LEFT JOIN correct_table c ON q.question_ID = c.question_ID
            LEFT JOIN genre_table g ON q.question_ID = g.question_ID
            WHERE g.qualification_name LIKE ? OR g.question_genre LIKE ? OR g.question_years LIKE ? OR q.question_name LIKE ? OR q.question_text LIKE ? OR q.question_id LIKE ? OR pics_name LIKE ?
            OR c.correct LIKE ?
            `,
            value: [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
        }
        const countRows = await SQL_exec(countQuery);
        console.log(countRows);
        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);
         var SQL_data ={
            sql: `
            SELECT 
                g.qualification_name,
                g.question_genre,
                g.question_years,
                q.question_name,
                q.question_text,
                q.question_ID,
                COALESCE(q.pics_name, '') AS pics_name,
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
            WHERE g.qualification_name LIKE ? OR g.question_genre LIKE ? OR g.question_years LIKE ? OR q.question_name LIKE ? OR q.question_text LIKE ? OR q.question_id LIKE ? OR pics_name LIKE ?
                  OR c.correct LIKE ?
            GROUP BY 
                q.question_ID, g.qualification_name, g.question_genre, g.question_years, 
                q.question_name, q.question_text, q.pics_name, c.correct
             limit ? offset ?;
          `,
          value:[`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,limit,offset]
        }
        req.session.limit = limit;
        req.session.offset = offset;
        req.session.save();
        var results = await SQL_exec(SQL_data)
        res.render('Question_manage', { questions: results,name:req.session.user.username,currentPage:page,totalPages: totalPages,search: search });
    }catch(error){
        console.log(error);
        const err = new Error('セッションが切れています。ログインしてください。');
        err.status = 401; // HTTPステータスコード 401 (Unauthorized)
        return next(err); // 次のエラーハンドリングミドルウェアに渡す
    }
})

module.exports = router;