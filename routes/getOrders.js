const express = require('express');
const async = require('async');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

// 진행중인 주문
router.post('/wait', function (req, res, next) {
    console.log('GET getOrders/wait 호출됨');

    var saleHistorys = [];
    async.waterfall([
        function (callback) {
                var fromDate = req.body.fromDate;
                var toDate = req.body.toDate;
                var keyword = req.body.keyword;
                var stmt = '';
                if (keyword == '')
                    stmt = 'SELECT * FROM honorscloset.order WHERE SaleDate IS NULL AND OrderDate >= ? AND OrderDate <= ?;';
                else
                    stmt = 'SELECT * FROM honorscloset.order WHERE SaleDate IS NULL AND OrderDate >= ? AND OrderDate <= ? AND No = "' + keyword + '";';

                var param = [2];
                // from datetime
                //var fromDate = fromDate.substring(0, 4) + '-' + fromDate.substring(0, 4)
                param[0] = fromDate;
                // to datetime
                param[1] = toDate;
                conn.query(stmt, param, function (err, rows, fields) {
                    if (err) {
                        console.log(error);
                    } else {
                        saleHistorys = rows;
                        callback(null, saleHistorys);
                    }
                });
        },
        function (saleHistorys, callback) {
                var getOrderedProducts = function (idx) {
                    var index = idx;
                    return function (callback) {
                        async.waterfall([
                        function (callback) {
                                    var stmt = 'SELECT orderedproduct.Order_No, orderedproduct.Sale_Price, product.* FROM honorscloset.orderedproduct INNER JOIN honorscloset.product ON orderedproduct.Product_Code = product.Code WHERE Order_No = ?;';
                                    var param = [1];
                                    param[0] = saleHistorys[index].No;
                                    conn.query(stmt, param, function (err, rows, fields) {
                                        if (err) {
                                            console.log(error);
                                        } else {
                                            callback(null, rows);
                                        }
                                    });
                        },
                        function (rows, callback) {
                                    saleHistorys[index].orderedProducts = rows;
                                    callback(null, rows);
                         }],
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('warterfall end');
                                    callback(null, 'success : ' + index)
                                }
                            });
                    }
                }

                var parallelFuncList = [];
                for (var i = 0; i < saleHistorys.length; i++) {
                    parallelFuncList.push(getOrderedProducts(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, 'success all');
                        }
                    }

                );
        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json(saleHistorys);
            }
        });
});

// 판매, 환불 완료된 주문내역
router.post('/salesHistory/all', function (req, res, next) {
    console.log('GET getOrders/salesHistory/all 호출됨');

    var saleHistorys = [];
    async.waterfall([
        function (callback) {
                var fromDate = req.body.fromDate;
                var toDate = req.body.toDate;
                var keyword = req.body.keyword;
                var stmt = '';
                if (keyword == '')
                    stmt = 'SELECT * FROM honorscloset.order WHERE SaleDate IS NOT NULL AND SaleDate >= ? AND SaleDate <= ?;';
                else
                    stmt = 'SELECT * FROM honorscloset.order WHERE SaleDate IS NOT NULL AND SaleDate >= ? AND SaleDate <= ? AND No = "' + keyword + '";';

                var param = [2];
                // from datetime
                param[0] = fromDate;
                // to datetime
                param[1] = toDate;
                conn.query(stmt, param, function (err, rows, fields) {
                    if (err) {
                        console.log(error);
                    } else {
                        saleHistorys = rows;
                        callback(null, saleHistorys);
                    }
                });
        },
        function (saleHistorys, callback) {
                var getOrderedProducts = function (idx) {
                    var index = idx;
                    return function (callback) {
                        async.waterfall([
                        function (callback) {
                                    var stmt = 'SELECT orderedproduct.Order_No, orderedproduct.Sale_Price, product.* FROM honorscloset.orderedproduct INNER JOIN honorscloset.product ON orderedproduct.Product_Code = product.Code WHERE Order_No = ?;';
                                    var param = [1];
                                    param[0] = saleHistorys[index].No;
                                    conn.query(stmt, param, function (err, rows, fields) {
                                        if (err) {
                                            console.log(error);
                                        } else {
                                            callback(null, rows);
                                        }
                                    });
                        },
                        function (rows, callback) {
                                    saleHistorys[index].orderedProducts = rows;
                                    callback(null, rows);
                         }],
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('warterfall end');
                                    callback(null, 'success : ' + index)
                                }
                            });
                    }
                }

                var parallelFuncList = [];
                for (var i = 0; i < saleHistorys.length; i++) {
                    parallelFuncList.push(getOrderedProducts(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            callback(null, 'success all');
                        }
                    }

                );
        }],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('warterfall end');
                res.json(saleHistorys);
            }
        });
});

// 매출 내역 조회
router.post('/getSalesStatement', function (req, res, next) {
    console.log('POST getOrders/salesHistory/getSalesStatement 호출됨');

    var result = new Object();
    result.cashAmount = '0';
    result.accountAmount = '0';
    result.tmp = '0';
    result.totalAmount = '0';

    var getCashAmount = function (callback) {
        var fromDate = req.body.fromDate;
        var toDate = req.body.toDate;
        var stmt = 'SELECT SUM(Price) as "cashAmount" FROM honorscloset.order WHERE SaleDate IS NOT NULL AND SaleDate >= ? AND SaleDate <= ? AND isCanceled = "0" AND isCash = "1";';
        var param = [2];
        // from datetime
        param[0] = fromDate;
        // to datetime
        param[1] = toDate;
        conn.query(stmt, param, function (err, rows, fields) {
            if (err) {
                console.log(error);
            } else {
                result.cashAmount = rows[0].cashAmount;
                if (result.cashAmount == null) result.cashAmount = '0';
                callback(null, result.cashAmount);
            }
        });
    }
    var getAccountAmount = function (callback) {
        var fromDate = req.body.fromDate;
        var toDate = req.body.toDate;
        var stmt = 'SELECT SUM(Price) as "accountAmount" FROM honorscloset.order WHERE SaleDate IS NOT NULL AND SaleDate >= ? AND SaleDate <= ? AND isCanceled = "0" AND isCash = "0";';
        var param = [2];
        // from datetime
        param[0] = fromDate;
        // to datetime
        param[1] = toDate;
        conn.query(stmt, param, function (err, rows, fields) {
            if (err) {
                console.log(error);
            } else {
                result.accountAmount = rows[0].accountAmount;
                if (result.accountAmount == null) result.accountAmount = '0';
                callback(null, result.accountAmount);
            }
        });
    }

    var parallelFuncList = [];
    parallelFuncList.push(getCashAmount);
    parallelFuncList.push(getAccountAmount);

    async.parallel(
        parallelFuncList,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results)
                result.totalAmount = Number(result.cashAmount) + Number(result.accountAmount);
                res.json(result);
            }
        }
    );

});

router.post('/OrderCnt', function (req, res, next) {
    console.log('getOrders/OrderCnt 호출됨');
    var stmt = 'SELECT count(*) as cnt from `order` WHERE `order`.SaleDate = null;'

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    })
});

router.post('/TodaySales', function (req, res, next) {
    console.log('POST getOrders/TodaySales 호출됨');

    var Start = req.body.Start;
    var End = req.body.End;

    console.log(Start, End);

    var stmt = 'SELECT Price FROM `order` WHERE `order`.SaleDate >= ? AND `order`.SaleDate <= ?;'

    conn.query(stmt, [Start, End], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var DATA = {
                'Sum': 0
            };
            var SalesSum = 0;
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                SalesSum += Number(rows[i].Price);
            }
            DATA['Sum'] = SalesSum;
            res.json(DATA);
        }
    })
})

router.post('/AllSales', function (req, res, next) {
    console.log('POST getOrders/TodaySales 호출됨');

    var stmt = 'SELECT Price FROM `order` WHERE SaleDate is not NULL AND isCanceled = "0";'

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var DATA = {
                'Sum': 0
            };
            var SalesSum = 0;
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                SalesSum += Number(rows[i].Price);
            }
            DATA['Sum'] = SalesSum;
            res.json(DATA);
        }
    })
})

module.exports = router;
