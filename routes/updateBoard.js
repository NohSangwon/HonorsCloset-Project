const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/ReviewHidden',function(req,res){
    console.log('POST /updateBoard/ReviewHidden 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Hidden = req.body.isHidden;
    var No = req.body.No;
    var stmt = 'Update board SET isHidden = ? WHERE No = ? AND Specification = "2"'

    conn.query(stmt,[Hidden,No], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
          console.log('Success!');
          res.json('Success!');
        }
    });
})

router.post('/Update',function(req,res){
    console.log('POST /updateBoard/Update 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Title = req.body.Title;
    var isNotice = req.body.isNotice;
    var Contents = req.body.Contents;
    var Date = req.body.Date;
    var No = req.body.No;
    var Specification = req.body.Specification;

    var stmt = 'Update board SET Title = ?, isNotice = ?, Contents = ?, Date = ? WHERE No = ? and Specification = ?'

    conn.query(stmt, [Title,isNotice,Contents,Date,No,Specification], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
          console.log('Success!');
          res.json('Success!');
        }
    });
})

router.post('/usercheck', function (req, res, next) {
    if (req.session.user) {
        var Writer = req.body.Writer;
        if (Writer == req.session.user.ID) {
            console.log('POST updateBoard/usercheck 호출됨');
            res.send('success');
        } else {
            res.send('err');
        }
    } else {
        res.send('err');
    }
});

router.post('/updateReview', function (req, res, next) {
    var Title = req.body.Title;
    var Contents = req.body.Contents;
    var Date = req.body.Date;
    var No = req.body.No;
    console.log(Title);
    console.log(Contents);
    console.log(Date);
    console.log(No);
    var stmt = 'UPDATE honorscloset.board SET Title=?, Contents=?, Date=? WHERE No=?';
    conn.query(stmt, [Title, Contents, Date, No], function (err, rows, fields) {
        if (err) {
            console.log('db error');
        } else {
            res.send('success');
        }
    });
});

module.exports = router;
