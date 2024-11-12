var express = require('express');
var router = express.Router();
const async = require('async');
const { SQL_exec } = require('../db/SQL_module');

//このページに来たら最初に行う処理
/* GET users listing. */

router.get('/', async function(req, res) {
  try {
      var user_ID = req.query.userID;
      var user_name = req.query.userName;
      var password = req.query.password;
  
      var selectSQL = {
          sql: 'select user_type from user_table where user_ID = ?;',
          value: [user_ID]
      };
       
      var result = await SQL_exec(selectSQL);
      var role_name = role_sort(result[0].user_type);

      var data = {
          user_ID: user_ID,
          user_name: user_name,
          pass_word: password,
          role_name: role_name
      };
      res.render('account_edit.ejs', data);
  } catch (err) {
      console.error(err);
      res.status(500).send("エラーが発生しました");
  }
});

async function role_sort(data){
  switch(data){
    case 1: return "生徒";
    case 2: return "教師";
    case 3: return "管理者";
  }
}
module.exports = router;