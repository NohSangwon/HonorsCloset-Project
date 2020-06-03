const express = require('express');
const multer = require("multer");
const path = require('path');

const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');
const checkADMIN = ('./checkADMIN');

const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

router.post('/complete', function (req, res) {
    console.log("/Calculate/getCalculate 호출됨");
    if(checkADMIN == '-9999'){
      return;
    }

    var seasonCode = req.body.seasonCode;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var totalStockAmount = req.body.totalStockAmount;
    var totalStockPrice = req.body.totalStockPrice;

    var stmt = 'UPDATE honorscloset.Calculate SET StartDate=?, EndDate=?, TotalStockAmount=?, TotalStockPrice=? WHERE Season=?;';
    var param = [5];
    param[0] = fromDate;
    param[1] = toDate;
    param[2] = Number(totalStockAmount);
    param[3] = Number(totalStockPrice);
    param[4] = seasonCode;

    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.json('err');
        } else {
            var stmt = 'SET SQL_SAFE_UPDATES =0; UPDATE honorscloset.Product SET isCalculate="1" WHERE isCalculate = "0" AND (Progress = "3" OR Progress = "4");';
            conn.query(stmt, param, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.json('err');
                } else {
                    res.json('success');
                }
            });
        }
    });
});

router.post('/getCalculate', function (req, res) {
    console.log("/Calculate/getCalculate 호출됨");
    if(checkADMIN == '-9999'){
      return;
    }

    var seasonCode = req.body.seasonCode;
    console.log(seasonCode);

    var stmt = 'SELECT * FROM honorscloset.calculate WHERE Season = ?;'
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.json('err');
        } else {
            res.json(results);
        }
    });
});

router.post('/getProducts/all', function (req, res, next) {
    console.log('POST Calculate/getProducts/all 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Specification = req.body.Specification;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromCode = req.body.fromCode;
    var toCode = req.body.toCode;
    var isCalculate = req.body.isCalculate;
    console.log(Specification);
    console.log(fromDate);
    console.log(toDate);
    console.log(fromCode);
    console.log(toCode);
    console.log(isCalculate);

    var stmt = 'SELECT * FROM ' +
        '( (SELECT * FROM honorscloset.product LEFT JOIN ' +
        '(SELECT * FROM ' +
        '(SELECT orderedproduct.Product_Code, isCash, isCanceled, SaleDate FROM honorscloset.orderedproduct LEFT JOIN honorscloset.`order` ON orderedproduct.Order_No = `order`.No) as tmp ' +
        'WHERE isCanceled = "0") as tmp2 ' +
        'ON product.Code = tmp2.Product_Code)' +
        'UNION ' +
        '(SELECT * FROM honorscloset.product RIGHT JOIN ' +
        '(SELECT * FROM ' +
        '(SELECT orderedproduct.Product_Code, isCash, isCanceled, SaleDate FROM honorscloset.orderedproduct LEFT JOIN honorscloset.`order` ON orderedproduct.Order_No = `order`.No) ' +
        'as tmp WHERE isCanceled = "0") as tmp2 ' +
        'ON product.Code = tmp2.Product_Code) ) as result ' +
        'WHERE (((? <= SaleDate AND SaleDate <= ?) ' +
        'OR (? <= LossDate AND LossDate <= ?) ' +
        'OR (SaleDate IS NULL AND LossDate IS NULL)) AND (? <= Code AND Code <= ?)) AND isCalculate = ?';

    var param = [7]
    param[0] = fromDate;
    param[1] = toDate;
    param[2] = fromDate;
    param[3] = toDate;
    param[4] = fromCode;
    param[5] = toCode;
    param[6] = isCalculate;

    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.post('/getProducts/BySpecification', function (req, res, next) {
    console.log('POST Calculate/getProducts/BySpecification 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Specification = req.body.Specification;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromCode = req.body.fromCode;
    var toCode = req.body.toCode;
    var isCalculate = req.body.isCalculate;
    console.log(Specification);
    console.log(fromDate);
    console.log(toDate);
    console.log(fromCode);
    console.log(toCode);
    console.log(isCalculate);

    var stmt = 'SELECT * FROM ' +
        '( (SELECT * FROM honorscloset.product LEFT JOIN ' +
        '(SELECT * FROM ' +
        '(SELECT orderedproduct.Product_Code, isCash, isCanceled, SaleDate FROM honorscloset.orderedproduct LEFT JOIN honorscloset.`order` ON orderedproduct.Order_No = `order`.No) as tmp ' +
        'WHERE isCanceled = "0") as tmp2 ' +
        'ON product.Code = tmp2.Product_Code)' +
        'UNION ' +
        '(SELECT * FROM honorscloset.product RIGHT JOIN ' +
        '(SELECT * FROM ' +
        '(SELECT orderedproduct.Product_Code, isCash, isCanceled, SaleDate FROM honorscloset.orderedproduct LEFT JOIN honorscloset.`order` ON orderedproduct.Order_No = `order`.No) ' +
        'as tmp WHERE isCanceled = "0") as tmp2 ' +
        'ON product.Code = tmp2.Product_Code) ) as result ' +
        'WHERE (((? <= SaleDate AND SaleDate <= ?) ' +
        'OR (? <= LossDate AND LossDate <= ?) ' +
        'OR (SaleDate IS NULL AND LossDate IS NULL)) AND (? <= Code AND Code <= ?)) AND isCalculate = ? ';

    var param = [7]
    param[0] = fromDate;
    param[1] = toDate;
    param[2] = fromDate;
    param[3] = toDate;
    param[4] = fromCode;
    param[5] = toCode;
    param[6] = isCalculate;

    if (Specification == "Loss") {
        stmt += 'AND Progress = "4"';
    } else if (Specification == "Sell") {
        stmt += 'AND Progress = "3"';
    } else if (Specification == "A") {

    } else {
        stmt += 'AND Specification = "' + Specification + '";';
    }
    console.log(stmt);

    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log('Error!');
        } else {
            res.json(rows);
        }
    });
})

router.post('/getCalculateList/:orderRule', function (req, res) {
    console.log("/Calculate/getCalculateList 호출됨");
    if(checkADMIN == '-9999'){
      return;
    }

    // orderRule : ASC or DESC
    var stmt = 'SELECT * FROM honorscloset.calculate ORDER BY Season ' + req.params.orderRule + ';';
    conn.query(stmt, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.post('/deleteCalculateCut', function (req, res) {
    console.log("/Calculate/deleteCalculateCut 호출됨");
    if(checkADMIN == '-9999') {
      return;
    }

    var seasonCode = req.body.seasonCode;
    console.log(seasonCode);

    var stmt = 'DELETE FROM honorscloset.calculate WHERE Season = ?;'
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.send('success');
        }
    });
});

router.post('/insertCalculate', function (req, res) {
    console.log("/Calculate/insertCalculate 호출됨");
    if(checkADMIN == '-9999') {
      return;
    }

    var yearText = req.body.yearText;
    console.log(yearText);
    var seasonType = req.body.seasonType;
    console.log(seasonType);
    var seasonCode = yearText.substring(2, 4) + '-' + seasonType;
    console.log(seasonCode);

    async.waterfall([
        function (callback) {
                var stmt = 'SELECT * FROM honorscloset.calculate WHERE Season = ?;';
                var param = [1];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                        callback('err');
                    } else {
                        if (rows.length >= 1)
                            callback('이미 존재하는 정산 시즌입니다');
                        else
                            callback(null);
                    }
                });
        },
        function (callback) {
                var stmt = 'INSERT INTO honorscloset.calculate (Season) VALUES (?);';
                var param = [3];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                        callback('db error');
                    } else {
                        callback(null);
                    }
                });
        }],
        function (err, result) {
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                console.log('warterfall end');
                res.json('success');
            }
        });
});

// cash flow 관련

router.post('/cashflow/getItemGroupList', function (req, res) {
    console.log("/Calculate/cashflow/getItemGroupList 호출됨");
    if(checkADMIN == '-9999') {
      return;
    }

    var seasonCode = req.body.seasonCode;
    console.log(seasonCode);

    var stmt = 'SELECT * FROM honorscloset.cashflow WHERE Season = ?;'
    var param = [1];
    param[0] = seasonCode;

    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.json('err');
        } else {
            var nameList = results.map((x) => (x.Name));
            nameList = nameList.filter((item, index) => nameList.indexOf(item) == index);

            var itemGroupList = [];
            for (var i = 0; i < nameList.length; i++) {
                var itemList = results.filter((x) => x.Name == nameList[i]);
                var amount = 0;
                for (var j = 0; j < itemList.length; j++) {
                    amount += Number(itemList[j].Amount);
                }
                var itemGroup = {
                    name: nameList[i],
                    amount: amount,
                    itemList: itemList
                }
                itemGroupList.push(itemGroup);
            }
            console.log(itemGroupList);
            res.json(itemGroupList);
        }
    });
});

router.post('/cashflow/update', function (req, res) {
    console.log("/Calculate/cashflow/update 호출됨");
    if(checkADMIN == '-9999') {
      return;
    }

    var seasonCode = req.body.seasonCode;
    var itemGroupList = req.body.itemGroupList;
    console.log(seasonCode);
    console.log(itemGroupList);

    var no = 0;
    async.waterfall([
        function (callback) {
                var stmt = 'DELETE FROM honorscloset.cashflow WHERE Season = ?;'
                var param = [1];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                        callback('err');
                    } else {
                        callback(null);
                    }
                });
        },
        function (callback) {
                var stmt = 'SELECT No FROM honorscloset.cashflow ORDER BY No DESC limit 0, 1;';
                conn.query(stmt, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                        callback('err');
                    } else {
                        if (rows.length == 0)
                            no = 0;
                        else
                            no = Number(rows[0].No);
                        callback(null);
                    }
                });
        },
        function (callback) {
                var insertItem = function (idxI, idxJ, No_) {
                    var No = No_;
                    var indexI = idxI;
                    var indexJ = idxJ;
                    return function (callback) {
                        var stmt = 'INSERT INTO honorscloset.cashflow (Season, No, Name, Amount, Remark) VALUES (?, ?, ?, ?, ?);';
                        var param = [5];
                        param[0] = seasonCode;
                        param[1] = No;
                        param[2] = itemGroupList[indexI].itemList[indexJ].Name;
                        param[3] = itemGroupList[indexI].itemList[indexJ].Amount;
                        param[4] = itemGroupList[indexI].itemList[indexJ].Remark;
                        conn.query(stmt, param, function (err, rows, fields, next) {
                            if (err) {
                                console.log('err', '(' + indexI + ', ' + indexJ +') : err');
                                callback('err', '(' + indexI + ', ' + indexJ +') : err');
                            } else {
                                console.log(null, '(' + indexI + ', ' + indexJ +') : clear');
                                callback(null, '(' + indexI + ', ' + indexJ +') : clear');
                            }
                        });
                    }
                }

                var parallelFuncList = [];
                for (var i = 2; i < itemGroupList.length; i++) {
                    console.log(itemGroupList[i]);
                    if (itemGroupList[i] == null || itemGroupList[i] == undefined || itemGroupList[i] == '') continue;
                    for (var j = 0; j < itemGroupList[i].itemList.length; j++) {
                        console.log(itemGroupList[i].itemList[j]);
                        if (itemGroupList[i].itemList[j] == null || itemGroupList[i].itemList[j] == undefined || itemGroupList[i].itemList[j] == '') continue;
                        no++;
                        parallelFuncList.push(insertItem(i, j, no));
                    }
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                            callback('err');
                        } else {
                            console.log(results)
                            callback(null);
                        }
                    }

                );
        }],
        function (err) {
            if (err) {
                console.log(err);
                res.json('err');
            } else {
                console.log('warterfall end');
                res.json('success');
            }
        });
});

module.exports = router;
