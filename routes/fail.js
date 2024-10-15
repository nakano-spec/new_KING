var express = require('express');
var router = express.Router();
//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  //fail.ejsファイルをクライアントに表示する。
  res.render('fail.ejs');
});

module.exports = router;