const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/deleteNotice',function(req,res){
    console.log('POST /deleteBoard/deleteNotice 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var No = req.body.No;
    var stmt = 'DELETE FROM board WHERE No = ? AND Specification = "0"'

    conn.query(stmt,[No], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
          res.json('Success!');
        }
    });
})

router.post('/deleteFAQ',function(req,res){
    console.log('POST /deleteBoard/deleteFAQ 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var No = req.body.No;
    var stmt = 'DELETE FROM board WHERE No = ? AND Specification = "1"'

    conn.query(stmt,[No], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
          res.json('Success!');
        }
    });
})

router.post('/deleteReview', function (req, res, next) {
    if (req.session.user) {
        var Writer = req.body.Writer;
        console.log(Writer);
        console.log(req.session.user.ID);
        if (Writer == req.session.user.ID) {
            console.log('POST deleteBoard/deleteReview 호출됨');
            var No = req.body.No;
            var stmt = 'DELETE FROM honorscloset.board WHERE No=?';
            conn.query(stmt, [No], function (err, rows, fields) {
                if (err) {
                    console.log('db error');
                } else {
                    res.json(rows);
                }
            });
        } else{
            res.send('삭제 권한이 없습니다.');
        }
    } else {
        res.send('삭제 권한이 없습니다.');
    }
});

module.exports = router;
