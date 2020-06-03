const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');
var conn = createDBConnection();

var router = express.Router();

router.post('/all', function(req, res, next) {
    console.log('POST Member/all 호출됨');

    var stmt = 'SELECT * FROM honorscloset.customer;';

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
});

router.post('/toAdmin', function(req, res, next){
    console.log('POST Member/toAdmin 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var ID = req.body.ID;
    var Update_ID = ID.split(',');
    console.log(Update_ID);

    var stmt = "";
    for(var i = 0 ; i < Update_ID.length-1 ; i++){
      stmt += "UPDATE customer SET Specification = '0' WHERE ID = '" + Update_ID[i] + "';\n"
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

router.post('/toStudent', function(req, res, next){
    console.log('POST Member/toStudent 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var ID = req.body.ID;
    var Update_ID = ID.split(',');
    console.log(Update_ID);

    var stmt = "";
    for(var i = 0 ; i < Update_ID.length-1 ; i++){
      stmt += 'UPDATE customer SET Specification = "1" WHERE ID = "' + Update_ID[i] + '";';
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

router.post('/toStaff', function(req, res, next){
    console.log('POST Member/toStaff 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var ID = req.body.ID;
    var Update_ID = ID.split(',');
    console.log(Update_ID);

    var stmt = "";
    for(var i = 0 ; i < Update_ID.length-1 ; i++){
      stmt += 'UPDATE customer SET Specification = "2" WHERE ID = "' + Update_ID[i] + '";';
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

router.get('/member', function (req, res, next) {
    console.log('GET admin/Statics 호출됨');

    res.redirect('/Member.html');
});


router.post('/loadMember', function(req, res, next) {
    console.log('POST Member/all 호출됨');

    var stmt = 'SELECT * FROM honorscloset.member;';

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
});

router.post('/getCustomerByID', function(req, res, next) {
    console.log('POST getCustomerByID 호출됨');
    var id = req.body.id;
    
    var stmt = 'SELECT * FROM honorscloset.customer WHERE ID = ?;';
    var param = [1];
    param[0] = id;

    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
