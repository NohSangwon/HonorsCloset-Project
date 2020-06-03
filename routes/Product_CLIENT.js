const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

router.post('/loadProduct', function (req, res) {
    console.log('loadProduct 실행');
    conn.query('SELECT * FROM honorscloset.product where (Progress = "1" or Progress = "2"  or Progress = "3") and isCalculate = "0" and isOnline="1" ORDER BY Progress ASC', function (error, results, fields) {

        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
})

router.post('/buycomplete', function (req, res) {
    if (req.session.user) {
        console.log('buycomplete 호출');
        var Code = req.body.code;
        var Price = req.body.lastPrice;
        var Buyer_ID = req.session.user['ID'];
        var now1 = (new Date()).yyyymmdd();
        var now2 = dateToYYYYMMDDHHMMSS();
        console.log(now1);
        console.log(now2);
        var stmt4 = "update honorscloset.product set Progress='2', Buyer_ID=? where Code=?";
        var stmt3 = "INSERT INTO honorscloset.orderedproduct(Order_No, Product_Code, Sale_Price) VALUES (?,?,?)";
        var stmt2 = "INSERT INTO honorscloset.order(No, OrderDate, Price, CancelDate, isCanceled, Customer_ID) VALUES (?,?,?,'-',0,?)";
        var stmt1 = "SELECT COUNT(*) as cnt FROM honorscloset.order WHERE No LIKE '" + now1 + "%'";

        conn.query(stmt1, function (err1, rows) {
            if (err1) {
                console.log('stmt1 db err');
            } else {
                var number = rows[0].cnt + 1;
                var length = 3;

                number = number + "" //number를 문자열로 변환하는 작업
                var str = ""
                for (var i = 0; i < length - number.length; i++) {
                    str = str + "0";
                }
                str = str + number;
                var No = now1 + str;

                conn.query(stmt2, [No, now2, Price, Buyer_ID], function (err2, rows) {
                    if (err2) {
                        console.log(err2);
                    } else {
                        conn.query(stmt3, [No, Code, Price], function (err3, rows) {
                            if (err3) {
                                console.log('stmt3 db err');
                            } else {
                                conn.query(stmt4, [Buyer_ID, Code], function (err4, rows) {
                                    if (err4) {
                                        console.log('stmt4 db err');
                                    } else {
                                        res.send('success');
                                    }
                                })
                            }
                        })

                    }
                })
            }
        });
    } else {
        res.send('err');
    }
})



router.post('/basketcomplete', function (req, res) {
    if (req.session.user) {
        console.log('basketcomplete 호출');
        var Code = req.body.code;
        var Buyer_ID = req.session.user['ID'];

        var stmt1 = "SELECT * FROM honorscloset.cart WHERE Customer_ID=? AND Product_Code=?";
        var stmt = "INSERT INTO honorscloset.cart(Product_Code, Customer_ID) VALUES (?,?)";
        conn.query(stmt1, [Buyer_ID, Code], function (err1, rows) {
            console.log(rows);
            if (rows.length > 0) {
               res.send('err1');
            } else {
                conn.query(stmt, [Code, Buyer_ID], function (err2, rows) {
                    if (err2) {
                        console.log('db err');
                    } else {
                        res.send('success');
                    }
                });
            }

        })

    } else {
        res.send('err2');
    }
})

router.post('/interestcomplete', function (req, res) {
    if (req.session.user) {
        console.log('interestcomplete 호출');
        var Code = req.body.code;
        var Buyer_ID = req.session.user['ID'];
        console.log(Code);
        var stmt1 = "SELECT * FROM honorscloset.interestitem WHERE Customer_ID=? AND Product_Code=?";
        var stmt = "INSERT INTO honorscloset.interestitem(Product_Code, Customer_ID) VALUES (?,?)";
        conn.query(stmt1, [Buyer_ID, Code], function (err1, rows) {
            console.log(rows);
            if (rows[0] == null) {
                  conn.query(stmt, [Code, Buyer_ID], function (err2, rows) {
                    if (err2) {
                        console.log('db err');
                    } else {
                        res.send('success');
                    }
                });
             
            } else {
                res.send('err1');
            }

        })

    } else {
        res.send('err2');
    }
})

router.post('/DeleteInterest', function (req, res) {
    console.log('deleteinterest 호출');
    var Code = req.body.code;
    var Buyer_ID = req.session.user['ID'];
    console.log(Code);
    console.log(Buyer_ID);
    var stmt = "DELETE FROM honorscloset.interestitem WHERE Product_Code = ? AND Customer_ID = ?";
    conn.query(stmt, [Code, Buyer_ID], function (err, rows) {
        if (err) {
            console.log('db err');
        } else {
            res.send('success');
        }
    });
})

router.post('/DeleteBasket', function (req, res) {
    console.log('deletebasket 호출');
    var Code = req.body.code;
    var Buyer_ID = req.session.user['ID'];
    console.log(Code);
    console.log(Buyer_ID);
    var stmt = "DELETE FROM honorscloset.cart WHERE Product_Code = ? AND Customer_ID = ?";
    conn.query(stmt, [Code, Buyer_ID], function (err, rows) {
        if (err) {
            console.log('db err');
        } else {
            res.send('success');
        }
    });
})

router.post('/increaseHit', function (req, res) {
        var Code = req.body.code;

        var stmt = "UPDATE honorscloset.product SET Hit = Hit+1 WHERE product.Code = ?";
        conn.query(stmt, [Code], function (err1, rows) {
                res.send('increase!');
        });
})

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}


function dateToYYYYMMDDHHMMSS() {
    var date = new Date();

    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
}


module.exports = router;
