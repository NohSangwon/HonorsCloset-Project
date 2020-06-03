const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

// Board Module
router.get('/notice',function(req,res){
	console.log('notice 호출됨');

	var stmt = 'SELECT * FROM honorscloset.Board WHERE Specification = "0";';
	conn.query(stmt, function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			res.json(rows);
		}
	})
})

router.get('/noticedetail',function(req,res){
	console.log('noticedetail 호출됨');

	var stmt = 'SELECT * FROM honorscloset.Board WHERE id = ?';
	conn.query(stmt,[para],function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			res.json(rows);
		}
	})
})

module.exports = router;
