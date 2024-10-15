var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('kanryou.ejs');
});

module.exports = router;