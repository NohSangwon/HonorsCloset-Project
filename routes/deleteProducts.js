const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/ByCode', function(req, res, next) {
    console.log('POST deleteProducts/ByCode 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var stmt = "";
    var Code = req.body.Code;
    var Delete_Code = Code.split(',');
    console.log(Delete_Code);
    for(var i = 0 ; i < Delete_Code.length-1 ; i++){
      stmt += 'DELETE FROM product WHERE Code = "' + Delete_Code[i] + '";';
      console.log(stmt);
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            res.send({msg:"Success"});
        }
    });
});

module.exports = router;
