const express = require('express');
const async = require('async');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');
var conn = createDBConnection();

var router = express.Router();

router.post('/getInfo',function(req,res,next){
  console.log('POST Info/getInfo 호출됨');
  if(checkADMIN == '-9999'){
    return;
  }

  var Code = req.body.Code;

  var stmt = 'SELECT Info FROM product WHERE Code = ? ;'

  conn.query(stmt, Code, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/updateInfo',function(req,res,next){
  console.log('POST Info/updateInfo 호출됨');
  if(checkADMIN == '-9999'){
    return;
  }

  var Info = req.body.Info;
  var Code = req.body.Code;

  var stmt = 'UPDATE product SET Info = ?, Progress = "1", isOnline="1" WHERE Code = ? AND Progress != "3" ;'

  conn.query(stmt, [Info,Code], function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

module.exports = router;
