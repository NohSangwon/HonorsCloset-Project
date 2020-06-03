const express = require('express');
const async = require('async');
const createDBConnection = require('./createDBConnection');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

var getSingUpStatics = function (fDate, tDate) {
  if(checkADMIN == '-9999'){
    return;
  }

    var fromDate = fDate;
    var toDate = tDate;

    return function (callback) {
        var stmt = 'SELECT DISTINCT RegistDate FROM honorscloset.customer WHERE ? <= RegistDate AND RegistDate <= ? ORDER BY RegistDate ASC;';
        var param = [2];
        param[0] = fromDate;
        param[1] = toDate;
        conn.query(stmt, param, function (err, rows, fields) {
            if (err) {
                console.log('db error');
            } else {
                var signUpDates = rows;
                var totalSignUp = 0;
                var maxNum = 0;

                var countSignUpOfDate = function (idx) {
                    var index = idx;

                    return function (callback) {
                        stmt = 'SELECT count(*) as cnt FROM honorscloset.customer WHERE RegistDate = ?;';
                        param = [1];
                        param[0] = signUpDates[index].RegistDate;
                        conn.query(stmt, param, function (err, rows, fields) {
                            if (err) {
                                console.log('db error');
                            } else {
                                signUpDates[index].cnt = rows[0].cnt;
                                totalSignUp += rows[0].cnt;
                                if (maxNum < rows[0].cnt)
                                    maxNum = rows[0].cnt;
                                callback(null, {
                                    RegistDate: signUpDates[index].RegistDate,
                                    cnt: signUpDates[index].cnt
                                });
                            }
                        });
                    }
                }

                var parallelFuncList = [];
                for (var i = 0; i < signUpDates.length; i++) {
                    parallelFuncList.push(countSignUpOfDate(i));
                }

                async.parallel(
                    parallelFuncList,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            var result = new Object();
                            result.totalSignUp = totalSignUp;
                            result.max = maxNum;
                            result.staticsSignUp = results;
                            callback(result);
                        }
                    });
            }
        });
    }
}

router.post('/SignUp/year', function (req, res, next) {
    console.log('POST Statics/SignUp/year 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    async.waterfall(
        [getSingUpStatics(fromDate, toDate)],
        function (result, err) {
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                console.log('warterfall end');
                var staticsSignUp = result.staticsSignUp;

                if (staticsSignUp.length > 0) {
                    var newStatics = [];

                    var tmpRDSubYear = staticsSignUp[0].RegistDate.substring(0, 4);
                    var tmpCnt = staticsSignUp[0].cnt;
                    newStatics.push({
                        RegistDate: tmpRDSubYear,
                        cnt: tmpCnt
                    });
                    var currIdx = 0;

                    for (var i = 1; i < staticsSignUp.length; i++) {
                        var nextRDSubYear = staticsSignUp[i].RegistDate.substring(0, 4);
                        var nextCnt = staticsSignUp[i].cnt
                        if (newStatics[currIdx].RegistDate == nextRDSubYear) {
                            newStatics[currIdx].cnt += nextCnt;
                        } else {
                            newStatics.push({
                                RegistDate: nextRDSubYear,
                                cnt: nextCnt
                            });
                            currIdx++;
                        }
                    }
                    result.staticsSignUp = newStatics;

                    var maxNum = newStatics[0].cnt;
                    for (var i = 1; i < newStatics.length; i++) {
                        if (maxNum < newStatics[i].cnt)
                            maxNum = newStatics[i].cnt;
                    }
                    result.max = maxNum;
                }

                res.json(result);
            }
        });
});

router.post('/SignUp/month', function (req, res, next) {
    console.log('POST Statics/SignUp/month 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    async.waterfall(
        [getSingUpStatics(fromDate, toDate)],
        function (result, err) {
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                console.log('warterfall end');
                var staticsSignUp = result.staticsSignUp;

                if (staticsSignUp.length > 0) {
                    var newStatics = [];

                    var tmpRDSubMonth = staticsSignUp[0].RegistDate.substring(0, 6);
                    var tmpCnt = staticsSignUp[0].cnt;
                    newStatics.push({
                        RegistDate: tmpRDSubMonth,
                        cnt: tmpCnt
                    });
                    var currIdx = 0;

                    for (var i = 1; i < staticsSignUp.length; i++) {
                        var nextRDSubMonth = staticsSignUp[i].RegistDate.substring(0, 6);
                        var nextCnt = staticsSignUp[i].cnt
                        if (newStatics[currIdx].RegistDate == nextRDSubMonth) {
                            newStatics[currIdx].cnt += nextCnt;
                        } else {
                            newStatics.push({
                                RegistDate: nextRDSubMonth,
                                cnt: nextCnt
                            });
                            currIdx++;
                        }
                    }
                    result.staticsSignUp = newStatics;

                    var maxNum = newStatics[0].cnt;
                    for (var i = 1; i < newStatics.length; i++) {
                        if (maxNum < newStatics[i].cnt)
                            maxNum = newStatics[i].cnt;
                    }
                    result.max = maxNum;
                }

                res.json(result);
            }
        });
});

router.post('/SignUp/day', function (req, res, next) {
    console.log('POST Statics/SignUp/day 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    async.waterfall(
        [getSingUpStatics(fromDate, toDate)],
        function (result, err) {
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                console.log('warterfall end');
                res.json(result);
            }
        });
});

router.post('/TotalSignUp', function (req, res, next) {
  if(checkADMIN == '-9999'){
    return;
  }
  
    var stmt = 'SELECT count(*) as total FROM honorscloset.customer;';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows[0]);
        }
    });
});

module.exports = router;
