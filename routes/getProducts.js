const express = require('express');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/all', function (req, res, next) {
    console.log('POST getProducts/all 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product;';

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
});

router.post('/UnSelled', function (req, res, next) {
    console.log('POST getProducts/UnSelled 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress != "3";';

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
});

router.post('/BySpecification', function (req, res, next) {
    console.log('POST getProducts/BySpecification 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Specification = req.body.Specification;

    var stmt = "";
    if (Specification == "Loss") {
        stmt = "SELECT * FROM honorscloset.product WHERE Progress = '4'";
    } else if (Specification == "Sell") {
        stmt = "SELECT * FROM honorscloset.product WHERE Progress = '3'";
    } else if (Specification == "A") {
        stmt = "SELECT * FROM honorscloset.product";
    } else {
        stmt = 'SELECT * FROM honorscloset.product WHERE Specification = "' + Specification + '";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
})

router.post('/BySpecification_UnSell', function (req, res, next) {
    console.log('POST getProducts/BySpecification 호출됨');
    var Specification = req.body.Specification;
    console.log(Specification);

    var stmt = "";
    if (Specification == "Loss") {
        stmt = "SELECT * FROM honorscloset.product WHERE Progress = '4'";
    } else if (Specification == "A") {
        stmt = "SELECT * FROM honorscloset.product WHERE Progress != '3'";
    } else {
        stmt = 'SELECT * FROM honorscloset.product WHERE Specification = "' + Specification + '" and Progress != "3";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
})

router.post('/Count', function (req, res, next) {
    console.log('POST getProducts/Count 호출됨');
    var Code = req.body.Code;

    var PreStmt = 'SELECT Code FROM honorscloset.product WHERE Code LIKE "' + Code + '%"';
    var Count = 0;
    var CountStr = '';
    conn.query(PreStmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            // 총 갯수 + 1 = 새로운 순서
            console.log(rows.length);
            Count = rows.length + 1;
            CountStr = CountStr + Count;

            //Padding 작업
            for (var i = 0; i < (4 - CountStr.length); i++) {
                CountStr = '0' + CountStr;
            }

            Code = Code + CountStr;
            res.send({
                Result: Code
            });
        }
    })
})

router.post('/ByCode',function(req,res,next){
  console.log('POST getProducts/ByCode 호출됨');
  Code = req.body.Code;

  var stmt = 'SELECT * FROM honorscloset.product WHERE Code = ?';

  conn.query(stmt, [Code], function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/Selled',function(req,res,next){
  console.log('POST getProducts/Selled 호출됨');

  var pageNum = Number(req.body.pageNum);
  var showNum = Number(req.body.showNum);

  var stmt = "SELECT DISTINCT Order_No, Product_Code, Sale_Price, SaleDate, isCash, Customer_ID FROM orderedproduct, `order` WHERE orderedproduct.Order_No = `order`.`No` AND isCanceled = 0 ORDER BY SaleDate DESC Limit ?, ?;";

  var param = [2];
  param[0] = 0 + showNum * (pageNum - 1); // 0 20 40
  param[1] = showNum; // 20

  conn.query(stmt, param, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/SelledCount',function(req,res,next){
  console.log('POST getProducts/SelledCount 호출됨');

  var stmt = 'SELECT count(*) as cnt FROM honorscloset.product WHERE Progress = "3";';

  conn.query(stmt, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/AllCount',function(req,res,next){
  console.log('POST getProducts/AllCount 호출됨');

  var stmt = 'SELECT count(*) as cnt FROM honorscloset.product;';

  conn.query(stmt, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/UnSellCount',function(req,res,next){
  console.log('POST getProducts/UnSellCount 호출됨');

  var stmt = 'SELECT count(*) as cnt FROM honorscloset.product WHERE Progress != "3";';

  conn.query(stmt, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/LossCount',function(req,res,next){
  console.log('POST getProducts/LossCount 호출됨');

  var stmt = 'SELECT count(*) as cnt FROM honorscloset.product WHERE Progress = "4";';

  conn.query(stmt, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

router.post('/SellCount',function(req,res,next){
  console.log('POST getProducts/SellCount 호출됨');

  var stmt = 'SELECT count(*) as cnt FROM honorscloset.product WHERE Progress = "3";';

  conn.query(stmt, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      res.json(rows);
    }
  })
})

// 여기부터 sale
router.get('/sale/all', function (req, res, next) {
    console.log('GET getProducts/sale/all 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/t', function (req, res, next) {
    console.log('GET getProducts/sale/t 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="T";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/b', function (req, res, next) {
    console.log('GET getProducts/sale/b 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="B";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/s', function (req, res, next) {
    console.log('GET getProducts/sale/s 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="S";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/o', function (req, res, next) {
    console.log('GET getProducts/sale/o 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="O";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/g', function (req, res, next) {
    console.log('GET getProducts/sale/g 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="G";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/sale/e', function (req, res, next) {
    console.log('GET getProducts/sale/e 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product WHERE Progress="1" AND Specification="E";';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/Hit/:num', function (req, res, next) {
    console.log('POST getProducts/Hit 호출됨');

    var stmt = 'SELECT * FROM honorscloset.product ORDER BY Hit DESC Limit 0, ?;';
    var param = [1];
    param[0] = Number(req.params.num);
    console.log(param[0]);
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log('db error!');
        } else {
            res.json(rows);
        }
    });
});

router.post('/isSelled',function(req,res,next){
  console.log('POST getProducts/isSelled 호출됨');
  Code = req.body.Code;

  var stmt = 'SELECT Progress FROM honorscloset.product WHERE Code = ?';

  conn.query(stmt, Code, function (err,rows,fields){
    if(err){
      console.log(err);
    }
    else {
      if(rows[0].Progress == '3'){
        res.json('err');
      }else {
        res.json('ok');
      }
    }
  })
})

module.exports = router;
