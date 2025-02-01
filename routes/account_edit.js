var express = require('express');
var router = express.Router();
const { SQL_exec } = require('../db/SQL_module');
var crypto = require('crypto');
const sha512 = crypto.createHash('sha512');
const encoding = 'hex';
//このページに来たら最初に行う処理
/* GET users listing. */

router.get('/', async (req,res,next) =>{
    const userID = req.query.userID;
    const userName = req.query.userName;
    const logTime = req.query.logTime;

    if (!userID || !userName || !logTime || !req.session.adminuser) {
      const err = new Error('必要な情報が不足しています。URLパラメータを確認してください。');
      err.status = 400; // HTTPステータスコード 400 (Bad Request)
      return next(err);
    }
    var data = {
      sql:'select user_ID,user_name,password,user_type from user_table where user_ID = ?',
      value:[userID]
    }
    var result =  await SQL_exec(data);
    var role = await role_sort(result[0].user_type);
    var data ={
      user_ID:result[0].user_ID,
      user_name:result[0].user_name,
      role_name:role
    }
    console.log(data);
    res.render('account_edit.ejs',data)
})

async function role_sort(data){
  switch(data){
    case 1: return "生徒";
    case 2: return "教師";
    case 3: return "管理者";
  }
}

function hashPassword(password) {
  const sha256 = crypto.createHash('sha512');
  sha256.update(password);
  return sha256.digest('hex');
}

module.exports = router;