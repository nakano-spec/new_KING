var express = require('express');
var router = express.Router();
const { SQL_exec } = require('../db/SQL_module');
var crypto = require('crypto');
const sha512 = crypto.createHash('sha512');
const encoding = 'hex';
//このページに来たら最初に行う処理
/* GET users listing. */

router.get('/', async (req,res) =>{
  var user_ID = req.query.userID;
  var data = {
    sql:'select user_ID,user_name,password,user_type from user_table where user_ID = ?',
    value:[user_ID]
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
/*router.get('/', function(req, res, next) {
  var user_ID = req.query.userID;
  var user_name = req.query.userName;
  var password = req.query.password;
  var app = req.app;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  var sql = 'select t.role_name from user_table u,User_Role t where u.user_type = t.user_type and u.user_ID = ?;';
  pool.getConnection(function(err,connection){
    connection.query(sql,user_ID,(err,result,fields) =>{
        if(err){
            console.log(err);
        }
        var data ={
          user_ID:user_ID,
          user_name:user_name,
          pass_word:password,
          role_name:result[0].role_name
        }
        res.render('account_edit.ejs',data);
       })
       connection.release();
   })
  
});*/

module.exports = router;