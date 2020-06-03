const express = require('express');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');
const mkdirp = require('mkdirp');
const checkADMIN = ('./checkADMIN');

const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

router.get('/loadArticle', function (req, res) {
    conn.query('SELECT * FROM honorscloset.article ORDER BY No DESC', function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
});

router.post('/getArticle', function (req, res) {
    var stmt = 'SELECT * FROM honorscloset.article WHERE No = ?;';
    var param = [1];
    param[0] = req.body.no;
    conn.query(stmt, param, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.post('/insert/:title/:date/:url', function (req, res) {
    console.log('POST Article/insert 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var articleUrl = req.params.url.replace(/~/g, '/');
    articleUrl = articleUrl.replace(/`/, '?');
    console.log(articleUrl);

    var nextNo = 0;
    async.waterfall([
        function (callback) {
                var stmt = 'SELECT No FROM honorscloset.article ORDER BY No DESC Limit 0, 1;';
                conn.query(stmt, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (rows == '') { // 오늘 등록된 주문이 없다.
                            nextNo = 0;
                        } else {
                            nextNo = Number(rows[0].No) + 1;
                        }
                        callback(null, nextNo);
                    }
                });
        },
        function (nextNo, callback) {
                var stmt = 'INSERT INTO honorscloset.article (No, Title, Thumbnail, URL, Date) VALUES (?, ?, ?, ?, ?);';
                var param = [5];
                param[0] = nextNo;
                param[1] = req.params.title;
                param[2] = '../src/article/' + String(nextNo) + '.jpg';
                param[3] = articleUrl;
                param[4] = req.params.date;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                        callback('err', nextNo);
                    } else {
                        callback(null, nextNo);
                    }
                });
        },
        function (nextNo, callback) {
                var dir = './HonorsCloset/src/article';
                var logoFileName = String(nextNo) + '.jpg';

                mkdirp(dir, function (err) {
                    if (err)
                        console.error(err);
                });
                var storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, dir);
                    },
                    filename: function (req, file, cb) {
                        cb(null, logoFileName);
                    }
                })

                // 1. 미들웨어 등록
                let upload = multer({
                    storage: storage
                });

                upload.single('articleThumbnail')(req, res, function (err) {
                    if (err) {
                        callback('err', nextNo);
                    } else {
                        callback(null, nextNo);
                    }
                });
        }],
        function (err, result) {
            if (err) {
                console.log(err);
                res.json('err');
            } else {
                console.log('warterfall end');
                res.json('success');
            }
        });
});

router.post('/update/:no/:title/:date/:url/:isImgUpdated', function (req, res) {
    console.log('POST Article/update 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    console.log(req.params.no);
    console.log(req.params.title);
    console.log(req.params.date);
    console.log(req.params.url);

    var articleUrl = req.params.url.replace(/~/g, '/');
    articleUrl = articleUrl.replace(/`/, '?');
    console.log(articleUrl);

    var nextNo = 0;
    async.waterfall([
        function (callback) {
                var stmt = 'UPDATE honorscloset.article SET Title=?, URL=?, Date=? WHERE No=?';
                var param = [5];
                param[0] = req.params.title;
                param[1] = articleUrl;
                param[2] = req.params.date;
                param[3] = req.params.no;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                        callback('err', req.params.no);
                    } else {
                        callback(null, req.params.no);
                    }
                });
        },
        function (no, callback) {
                if (req.params.isImgUpdated == 1) {
                    var dir = './HonorsCloset/src/article';
                    var logoFileName = no + '.jpg';

                    mkdirp(dir, function (err) {
                        if (err)
                            console.error(err);
                    });
                    var storage = multer.diskStorage({
                        destination: function (req, file, cb) {
                            cb(null, dir);
                        },
                        filename: function (req, file, cb) {
                            cb(null, logoFileName);
                        }
                    })

                    // 1. 미들웨어 등록
                    let upload = multer({
                        storage: storage
                    });

                    upload.single('articleThumbnail')(req, res, function (err) {
                        if (err) {
                            callback('err', nextNo);
                        } else {
                            callback(null, nextNo);
                        }
                    });
                } else {
                    callback(null, nextNo);
                }
        }],
        function (err, result) {
            if (err) {
                console.log(err);
                res.json('err');
            } else {
                console.log('warterfall end');
                res.json('success');
            }
        });
});

router.post('/delete', function (req, res) {
    console.log('POST Article/delete 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    async.waterfall([
        function (callback) {
                var stmt = 'DELETE FROM honorscloset.article WHERE No=?';
                var param = [1];
                param[0] = req.body.no;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                        callback(true);
                    } else {
                        callback(null);
                    }
                });
        },
        function (callback) {
                var imgPath = './HonorsCloset/src/article/' + req.body.no + '.jpg';
                console.log(imgPath);
                fs.unlink(imgPath, function (err) {
                    if (err) {
                        callback('err');
                    } else {
                        console.log('file deleted : ' + imgPath);
                        callback(null);
                    }
                })
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
