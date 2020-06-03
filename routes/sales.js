const express = require('express');
const async = require('async');
const moment = require('moment');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();
router.post('/checkIsOnSale', function (req, res, next) {
    console.log('POST checkIsOnSale 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }
    var products = req.body.products;

    var checkIsOnSaleFunc = function (idx) {
        var index = idx;
        return function (callback) {
            var stmt = 'SELECT * FROM honorscloset.product WHERE Code=?;';
            var params = [1];
            params[0] = products[index].Code; // ? : Code

            conn.query(stmt, params, function (err, rows, fields) {
                if (err) {
                    console.log('db error : ' + err);
                } else {
                    switch(Number(rows[0].Progress)) {
                        case 0: // 등록만 된 상품
                            callback(null, {Code:products[index].Code, isOnSale:0, msg:'등록된 상품(판매중X)'});
                            break;
                        case 1: // 판매 중
                            callback(null, {Code:products[index].Code, isOnSale:1, msg:'판매중'});
                            break;
                        case 2: // 입금 대기
                            callback(null, {Code:products[index].Code, isOnSale:0, msg:'입금 대기'});
                            break;
                        case 3: // 판매 완료
                            callback(null, {Code:products[index].Code, isOnSale:0, msg:'판매 완료'});
                            break;
                        case 9: // 삭제 완료
                            callback(null, {Code:products[index].Code, isOnSale:0, msg:'삭제 완료'});
                            break;
                    }
                }
            });
        }
    }


    var parallelFuncList = [];
    for (var i = 0; i < products.length; i++) {
        parallelFuncList.push(checkIsOnSaleFunc(i));
    }

    async.parallel(
        parallelFuncList,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                var isOnSale = 1;
                for (var i = 0; i< results.length; i++) {
                    if (Number(results[i].isOnSale) == 0)
                    {
                        isOnSale = 0;
                        break;
                    }
                }
                var result = {isOnSale:isOnSale ,info:results};
                res.json(result);
            }
        }
    );
})

router.post('/cashPay', function (req, res, next) {
    console.log('POST salesCashPay 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }
    console.log(req.body);

    var amount = req.body.amount;
    var seller = req.body.seller;
    var products = req.body.products;

    async.waterfall([
        function (callback) {
                var o_code = moment().format("YYYYMMDD");
                var stmt = 'SELECT * FROM honorscloset.order WHERE No LIKE ? ORDER BY No DESC Limit 0, 1;';
                var params = [1];
                params[0] = o_code + '%';
                conn.query(stmt, params, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                    } else {
                        if (rows == '') { // 오늘 등록된 주문이 없다.
                            o_code += '000';
                        } else {
                            o_code = Number(rows[0].No) + 1;
                        }
                        callback(null, o_code);
                    }
                });
        },
        function (o_code, callback) {
                var stmt = 'INSERT INTO honorscloset.order (No, OrderDate, SaleDate, Price, Customer_ID, isCanceled, isCash) VALUES (?, ?, ?, ?, ?, "0", "1");';
                var params = [5];
                params[0] = o_code; // ? : code
                params[1] = moment().format("YYYYMMDDHHmmss"); // ? : order_date
                params[2] = moment().format("YYYYMMDDHHmmss"); // ? : sales_date
                params[3] = amount; // ? : amount
                params[4] = '비회원'; // ? : Customer_ID

                conn.query(stmt, params, function (err, rows, fields) {
                    if (err) {
                        console.log('db error : ' + err);
                    } else {
                        callback(null, o_code);
                    }
                });
        },
        function (o_code, callback) {
                var insertOrderedProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        stmt = 'INSERT INTO honorscloset.orderedproduct (Order_No, Product_Code, Sale_Price) VALUES (?, ?, ?);';
                        var params = [3];
                        params[0] = o_code;
                        params[1] = products[index].Code;
                        params[2] = products[index].LastPrice;

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                callback(null, o_code);
                            }
                        });
                    }
                }
                var updateProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        var stmt = 'UPDATE honorscloset.product SET LastPrice=?, Seller_ID=?, Buyer_ID="비회원", Progress="3" WHERE Code=?;';
                        var params = [3];
                        params[0] = products[index].LastPrice; // ? : LastPrice
                        params[1] = seller; // ? : Seller_ID
                        params[2] = products[index].Code; // ? : Code

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                callback(null, 'UP :' + idx);
                            }
                        });
                    }
                }


                var parallelFuncList = [];
                for (var i = 0; i < products.length; i++) {
                    parallelFuncList.push(insertOrderedProduct(i));
                    parallelFuncList.push(updateProduct(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, o_code);
                        }
                    }

                );

        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json('현금결제 완료 (판매코드 : ' + result + ')');
            }
        });
});

router.post('/accountPay', function (req, res, next) {
    console.log('POST salesAccountPay 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }
    console.log(req.body);

    var amount = req.body.amount;
    var seller = req.body.seller;
    var products = req.body.products;

    async.waterfall([
        function (callback) {
                var o_code = moment().format("YYYYMMDD");
                var stmt = 'SELECT * FROM honorscloset.order WHERE No LIKE ? ORDER BY No DESC Limit 0, 1;';
                var params = [1];
                params[0] = o_code + '%';
                conn.query(stmt, params, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                    } else {
                        if (rows == '') { // 오늘 등록된 주문이 없다.
                            o_code += '000';
                        } else {
                            o_code = Number(rows[0].No) + 1;
                        }
                        callback(null, o_code);
                    }
                });
        },
        function (o_code, callback) {
                var stmt = 'INSERT INTO honorscloset.order (No, OrderDate, SaleDate, Price, Customer_ID, isCanceled, isCash) VALUES (?, ?, ?, ?, ?, "0", "0");';
                var params = [5];
                params[0] = o_code; // ? : code
                params[1] = moment().format("YYYYMMDDHHmmss"); // ? : order_date
                params[2] = moment().format("YYYYMMDDHHmmss"); // ? : sales_date
                params[3] = amount; // ? : amount
                params[4] = '비회원'; // ? : Customer_ID

                conn.query(stmt, params, function (err, rows, fields) {
                    if (err) {
                        console.log('db error : ' + err);
                    } else {
                        callback(null, o_code);
                    }
                });
        },
        function (o_code, callback) {
                var insertOrderedProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        stmt = 'INSERT INTO honorscloset.orderedproduct (Order_No, Product_Code, Sale_Price) VALUES (?, ?, ?);';
                        var params = [3];
                        params[0] = o_code;
                        params[1] = products[index].Code;
                        params[2] = products[index].LastPrice;

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                console.log('INSERT INTO honorscloset.orderedproduct : ' + params[0] + ', ' + params[1]);
                                callback(null, o_code);
                            }
                        });
                    }
                }
                var updateProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        var stmt = 'UPDATE honorscloset.product SET LastPrice=?, Seller_ID=?, Buyer_ID="비회원", Progress="3" WHERE Code=?;';
                        var params = [3];
                        params[0] = products[index].LastPrice; // ? : LastPrice
                        params[1] = seller; // ? : Seller_ID
                        params[2] = products[index].Code; // ? : Code

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                callback(null, 'UP :' + idx);
                            }
                        });
                    }
                }


                var parallelFuncList = [];
                for (var i = 0; i < products.length; i++) {
                    parallelFuncList.push(insertOrderedProduct(i));
                    parallelFuncList.push(updateProduct(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, o_code);
                        }
                    }

                );

        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json('계좌이체 결제 완료 (판매코드 : ' + result + ')');
            }
        });
});

router.post('/cancelSales', function (req, res, next) {
    console.log('POST sales/cancelSales 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var salesHistory = req.body.salesHistory;
    async.waterfall([
        function (callback) {
                var stmt = 'UPDATE honorscloset.order SET isCanceled=?, CancelDate=? WHERE No=?;';
                var params = [3];
                params[0] = '1';
                params[1] = moment().format("YYYYMMDDHHmmss");
                params[2] = salesHistory.No;
                conn.query(stmt, params, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                    } else {
                        callback(null, 'success');
                    }
                });
        },
        function (o_code, callback) {
                var updateOrderedProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        stmt = 'UPDATE honorscloset.product SET Progress="1", Seller_ID=NULL, Buyer_ID=NULL WHERE Code=?;';
                        var params = [1];
                        params[0] = salesHistory.orderedProducts[index].Code;

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                callback(null, 'success : ' + index);
                            }
                        });
                    }
                }

                var parallelFuncList = [];
                for (var i = 0; i < salesHistory.orderedProducts.length; i++) {
                    parallelFuncList.push(updateOrderedProduct(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, '판매취소 완료');
                        }
                    }
                );

        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json(result);
            }
        });
});


router.post('/confirmPayment', function (req, res, next) {
    console.log('POST sales/confirmPayment 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var salesHistory = req.body.salesHistory;
    async.waterfall([
        function (callback) {
                var stmt = 'UPDATE honorscloset.order SET SaleDate=?, isCash=? WHERE No=?;';
                var params = [3];
                params[0] = moment().format("YYYYMMDDHHmmss");
                params[1] = '0';
                params[2] = salesHistory.No;
                conn.query(stmt, params, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                    } else {
                        callback(null, 'success');
                    }
                });
        },
        function (o_code, callback) {
                var updateOrderedProduct = function (idx) {
                    var index = idx;
                    return function (callback) {
                        var stmt = 'UPDATE honorscloset.product SET LastPrice=?, Seller_ID="온라인판매", Progress="3" WHERE Code=?;';
                        var params = [2];
                        params[0] = salesHistory.orderedProducts[index].Sale_Price; // ? : LastPrice
                        params[1] = salesHistory.orderedProducts[index].Code; // ? : Code

                        conn.query(stmt, params, function (err, rows, fields) {
                            if (err) {
                                console.log('db error : ' + err);
                            } else {
                                callback(null, 'success : ' + index);
                            }
                        });
                    }
                }

                var parallelFuncList = [];
                for (var i = 0; i < salesHistory.orderedProducts.length; i++) {
                    parallelFuncList.push(updateOrderedProduct(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, '입금확인 처리 완료');
                        }
                    }
                );

        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json(result);
            }
        });
});

module.exports = router;
