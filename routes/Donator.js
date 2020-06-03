const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

router.get('/loadDonator',function(req,res){
    console.log('GET /Donator/loadDonator 호출됨');
    conn.query('SELECT * FROM honorscloset.donator ', function (error, results, fields) {

        if (error) {
            console.log(error);
        }
        else{
           res.json(results);
        }
    });
})

module.exports = router;
