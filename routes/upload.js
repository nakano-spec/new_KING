var express = require('express');
const { rename } = require('fs-extra');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/images')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({ storage: storage});
var router = express.Router();
router.post('/', upload.array('file'), function(req, res, next) {
    var j = 0;
  for(var i = 0;i<req.files.length;i++){
    console.log(req.files[j].originalname);
    j = j + 1
  }
});

module.exports = router;