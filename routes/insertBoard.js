const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/insert', function (req, res) {
    console.log('POST /insertboard/insert 호출됨');
    if (checkADMIN == '-9999') {
        return;
    }

    var No = req.body.No;
    var Specification = req.body.Specification;
    var Title = req.body.Title;
    var Contents = req.body.Contents;
    var Date = req.body.Date;
    var Writer = req.body.Writer;
    var isNotice = req.body.isNotice;

    var stmt = "INSERT INTO board VALUES(?,?,?,?,?,?,'0',?,'0')"

    conn.query(stmt, [No, Specification, Title, Contents, Date, Writer, isNotice], function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log('Success!');
            res.json('Success!');
        }
    });
})

router.post('/insertReview', function (req, res) {
    console.log('POST /insertBoard/insert 호출됨');

        var No = req.body.No;
        var Specification = req.body.Specification;
        var Title = req.body.Title;
        var Contents = req.body.Contents;
        var Date = req.body.Date;
        var Writer = req.session.user.ID;
        var isNotice = req.body.isNotice;

        console.log(Writer);
        var stmt = "INSERT INTO board (No,Specification,Writer,Title,Contents,Date,Hit,isNotice) VALUES(?,?,?,?,?,?,'0',?)"

        conn.query(stmt, [No, Specification, Writer, Title, Contents, Date, isNotice], function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                console.log('Success!');
                res.send('Success!');
            }
        });

})

router.post('/getCount', function (req, res) {
    console.log('POST /insertboard/getCount 호출됨');
    if (req.session.user) {
        var Specification = req.body.Specification;
        var No = 0;
        var Count = 0;

        var stmt = "SELECT No FROM board WHERE Specification = ? ORDER BY No DESC"

        conn.query(stmt, [Specification], function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                if (results == null || results.length == 0)
                    No = 0;
                else
                    No = results[0].No + 1;
                res.send({
                    No: No
                });
            }
        });
    } else {
        res.send('err');
    }
})


module.exports = router;