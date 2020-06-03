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

router.post('/loadLookbook',function(req,res){
    console.log("룩북 들어옴!");
    var season = req.body.Season;
    conn.query('SELECT * FROM honorscloset.lookbook WHERE Season=?',[season], function (error, results, fields) {

        if (error) {
            console.log(error);
        }
        else {
          var dir = results[0].Image + '';
          dir = './HonorsCloset' + dir.substr(2,19);
         console.log(dir);
          fs.readdir(dir,function(err,filelist){
       var jpgCounter = 0;
            for(var i = 0 ; i < filelist.length ; i++){
              if(filelist[i].split('.')[1] == 'jpg'){
                jpgCounter += 1;
              }
            }
            results[0]['Count'] = jpgCounter;
            res.json(results);
          })
        }
    });

})

router.post('/getVideo/', function (req, res) {
    console.log("/Lookbook/getVideo 호출됨");
    if(checkADMIN == '-9999'){
      return;
    }
    var seasonCode = req.body.seasonCode;

    var stmt = 'SELECT Video FROM honorscloset.lookbook WHERE Season = ?;';
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
            res.json('err');
        } else {
            res.json(rows);
        }
    });
});

router.post('/getLookbookList/:orderRule', function (req, res) {
    console.log("/Lookbook/getLookbookList 호출됨");
    // orderRule : ASC or DESC
    var stmt = 'SELECT * FROM honorscloset.lookbook ORDER BY Season ' + req.params.orderRule + ';';
    conn.query(stmt, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});


router.post('/getImageList', function (req, res) {
    console.log("/Lookbook/getImageList 호출됨");
    if (checkADMIN == '-9999') {
        return;
    }
    var seasonCode = req.body.seasonCode;

    var imgFiles = new Object();
    imgFiles.realImg = [];

    var startRealImgPath = './HonorsCloset/src/lookbook/' + seasonCode;

    var filter = /\.jpg$/
    mkdirp(startRealImgPath, function (err) {
        if (err)
            console.error(err);
    });
    if (!fs.existsSync(startRealImgPath)) {
        console.log("no dir ");
        res.json("no dir ");
    } else {
        var files = fs.readdirSync(startRealImgPath);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startRealImgPath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                continue;
            } else if (filter.test(filename)) {
                var filePath = './' + filename.replace(/\\/g, '/');
                var fileName = filePath.match(/\/([^\/]+).jpg/)[1];
                imgFiles.realImg.push(fileName);
            }
        };

        res.json(imgFiles);
    }
});

router.post('/deleteImg', function (req, res) {
    console.log("/Lookbook/deleteImg 호출됨");
    if (checkADMIN == '-9999') {
        return;
    }

    var season = req.body.season;
    var realImg = req.body.realImg;
    var thumbnail = req.body.thumbnail;
    console.log(season);
    console.log(realImg);
    console.log(thumbnail);

    var imgPath = './HonorsCloset/src/lookbook/' + season + '/' + realImg + '.jpg';
    console.log(imgPath);
    fs.unlink(imgPath, function (err) {
        if (err) {
            res.send('err');
        } else {
            res.send('success');
        }
    });
});


router.post('/insertImg/:seasonCode/:cnt', function (req, res) {
    console.log('POST Lookbook/insertImg/:seasonCode/:cnt 호출됨');
    if (checkADMIN == '-9999') {
        return;
    }

    var seasonCode = req.params.seasonCode;
    var cnt = req.params.cnt;
    console.log(seasonCode);
    console.log(cnt);


    var dir = './HonorsCloset/src/lookbook/' + seasonCode;
    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });

    var realImgFiles = [];
    var filter = /\.jpg$/;

    var files = fs.readdirSync(dir);
    console.log(files);
    for (var i = 0; i < files.length; i++) {
        var filename = files[i].match(/([^\/]*).jpg/);
        if (filename == null) continue;
        filename = filename[1];
        realImgFiles.push(filename);
    }
    console.log(realImgFiles);
    var index1 = 0;
    if (realImgFiles != undefined && realImgFiles != null && realImgFiles.length != 0) {
        var lastIndex = realImgFiles.length - 1;
        var lastName = realImgFiles[lastIndex];
        index1 = Number(lastName) + 1;
    }

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = './HonorsCloset/src/lookbook/' + seasonCode;
            mkdirp(dir, function (err) {
                if (err)
                    console.error(err);
            });
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            var filename = ((index1 < 10) ? '0' + String(index1++) : String(index1++)) + '.jpg';
            cb(null, filename);
        }
    })

    // 1. 미들웨어 등록
    let upload = multer({
        storage: storage
    });

    var fileFields = [{
        name: 'realImgInput',
        maxCount: cnt
        }];

    upload.fields(fileFields)(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send('err');
        } else {
            res.send('success');
        }
    });
});


router.post('/deleteLookbook', function (req, res) {
    console.log("/Lookbook/deleteLookbook 호출됨");
    if (checkADMIN == '-9999') {
        return;
    }
    var seasonCode = req.body.seasonCode;
    console.log(seasonCode);

    var deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    var stmt = 'DELETE FROM honorscloset.lookbook WHERE Season = ?;'
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            var dirPath = './HonorsCloset/src/lookbook/' + seasonCode;
            console.log(dirPath);
            deleteFolderRecursive(dirPath);

            res.send('success');
        }
    });
});

router.post('/insertLookbook', function (req, res) {
    console.log("/Lookbook/insertLookbook 호출됨");
    if (checkADMIN == '-9999') {
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
                var stmt = 'SELECT * FROM honorscloset.lookbook WHERE Season = ?;';
                var param = [1];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log('db error');
                        callback('err');
                    } else {
                        if (rows.length >= 1)
                            callback('이미 존재하는 컬렉션 시즌입니다');
                        else
                            callback(null);
                    }
                });
        },
        function (callback) {
                var stmt = 'INSERT INTO honorscloset.lookbook (Season, Video, Image) VALUES (?, ?, ?);';
                var param = [3];
                param[0] = seasonCode;
                param[1] = '../src/lookbook/' + seasonCode + '/01.mp4';
                param[2] = '../src/lookbook/' + seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
                        callback('db error');
                    } else {
                        callback(null);
                    }
                });
        },
        function (callback) {
                dir = './HonorsCloset/src/lookbook/' + seasonCode;
                mkdirp(dir, function (err) {
                    if (err)
                        console.error(err);
                });
                callback(null);
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

router.post('/deleteVideo', function (req, res) {
    console.log("/Lookbook/deleteVideo 호출됨");
    if (checkADMIN == '-9999') {
        return;
    }

    var seasonCode = req.body.seasonCode;
    var stmt = 'UPDATE honorscloset.lookbook SET Video = "" WHERE Season = ?;';
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
            res.json('err');
        } else {
            var videoPath = './HonorsCloset/src/lookbook/' + seasonCode + '/01.mp4';
            fs.unlink(videoPath, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('success');
                }
            });
            res.json('success');
        }
    });
});

router.post('/updateVideo/:seasonCode', function (req, res) {
    console.log('POST Lookbook/updateVideo 호출됨');
    if (checkADMIN == '-9999') {
        return;
    }

    var seasonCode = req.params.seasonCode;
    console.log(seasonCode);

    async.waterfall([
        function (callback) {
                var stmt = 'UPDATE honorscloset.lookbook SET Video = ? WHERE Season = ?;';
                var param = [2];
                param[0] = '../src/lookbook/' + seasonCode + '/01.mp4';
                param[1] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        callback('db err');
                    } else {
                        callback(null);
                    }
                });
        },
        function (callback) {
                var dir = './HonorsCloset/src/lookbook/' + seasonCode;
                var fileName = '01.mp4';
                mkdirp(dir, function (err) {
                    if (err)
                        console.error(err);
                });

                var storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, dir);
                    },
                    filename: function (req, file, cb) {
                        cb(null, fileName);
                    }
                })

                // 1. 미들웨어 등록
                let upload = multer({
                    storage: storage
                });

                upload.single('videoFile')(req, res, function (err) {
                    if (err) {
                        callback('err');
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

module.exports = router;
