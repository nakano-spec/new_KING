var express = require('express');
var router = express.Router();
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var name1 = req.query.name;

　　//app.jsの読み込み
      var app = req.app;
      //
      
      //データベース情報を読み込み
      var poolCluster = app.get("pool");
      var pool = poolCluster.of('MASTER')
      //
      //セッション情報の確認
      if(!req.session.student){
            res.render('login.ejs');
      }else{
          var sql = "select user_ID from user_table where user_name= ?;";
          pool.getConnection(function(err,connection){
            if(err){
              console.log(err);
              connection.release();
            }
            connection.query(sql,name1,(err,result,field)=>{
              if(err){
                console.log(err);
                connection.release();
              }
              var data ={
                name: result[0].user_ID 
              }
              res.render('kaitou.ejs',data);
              connection.release();
            })
          })
      }
});

module.exports = router;