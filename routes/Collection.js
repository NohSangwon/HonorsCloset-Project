const express = require('express');
const createDBConnection = require('./createDBConnection');
var conn = createDBConnection();

var router = express.Router();

router.post('/loadCollection',function(req,res){
    console.log('Collection/LoadCollection 호출됨');

    var Season = req.body.Season;

    conn.query('SELECT * FROM honorscloset.collection WHERE Season=?',Season, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
           res.json(results);
        }
    });
})

module.exports = router;
