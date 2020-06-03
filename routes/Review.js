const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

// Board Module
router.get('/review',function(req,res){
	console.log('notice 호출됨');

	var stmt = 'SELECT * FROM Board WHERE Specification = "2";';
	conn.query(stmt, function(err,rows,fields){
		if(err){
			console.log('db error');
		}else{
			res.json(rows);
		}
	})
})

router.get('/reviewdetail',function(req,res){
	console.log('noticedetail 호출됨');

	var stmt = 'SELECT * FROM Board WHERE id = ?';
	conn.query(stmt,[para],function(err,rows,fields){
		if(err){
			console.log('db error');
		}else{
			res.json(rows);
		}
	})
})

module.exports = router;
