const express = require('express');
const router = express.Router();
const { SQL_exec2 } = require('../db/SQL_module');

router.get('/',async function(req,res){
    try{
         var SQL_data ={
            sql: `
            SELECT 
                g.qualification_name,
                g.question_genre,
                g.question_years,
                q.question_name,
                q.question_text,
                q.question_id,
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
            GROUP BY 
                q.question_ID, g.qualification_name, g.question_genre, g.question_years, 
                q.question_name, q.question_text, q.pics_name, c.answer;
          `
        }
        var results = await SQL_exec2(SQL_data)
        res.render('Question_manage', { questions: results,name:req.session.user.username });
    }catch(error){
        console.log(error);
    }
})

module.exports = router;