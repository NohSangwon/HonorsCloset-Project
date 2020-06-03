const express = require('express');
const multer = require("multer");
const path = require('path');

const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');

const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();
var seasonCode = '19-2';

router.post('/getSeasonList/:orderRule', function (req, res) {
    console.log("/MemberCut/getSeasonList 호출됨");
    // orderRule : ASC or DESC
    var stmt = 'SELECT DISTINCT Season FROM honorscloset.season ORDER BY Season ' + req.params.orderRule + ';';
    conn.query(stmt, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});


router.post('/getMemberList', function (req, res) {
    console.log("/MemberCut/getMemberList 호출됨");
    var seasonCode = req.body.seasonCode;

    var stmt = 'SELECT * FROM honorscloset.member WHERE Season = ? ORDER BY Image ASC;';
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

router.post('/deleteMember', function (req, res) {
    console.log("/MemberCut/deleteMember 호출됨");
    var season = req.body.season;
    var name = req.body.name;
    var department = req.body.department;
    var imageName = req.body.imageName;
    var length = imageName.length;
    imageName = imageName.substring(length - 6, length - 4);

    console.log(season);
    console.log(name);
    console.log(department);
    console.log(imageName);

    var stmt = 'DELETE FROM honorscloset.member WHERE Season = ? AND Name = ? AND Department = ?'
    var param = [3];
    param[0] = season;
    param[1] = name;
    param[2] = department;
    conn.query(stmt, param, function (err, rows, fields, next) {
        if (err) {
            console.log(err);
            res.send('err');
        } else {
            console.log(err);
            var imgPath = './HonorsCloset/src/member/' + season + '/' + imageName + '.jpg';
            console.log(imgPath);
            fs.unlink(imgPath, function (err) {
                if (err) {
                    res.send('err');
                } else {
                    res.send('success');
                }
            });
        }
    });

});


router.post('/checkOverlap', function (req, res) {
    console.log('POST MemberCut/checkOverlap 호출됨');
    var seasonCode = req.body.seasonCode;
    var newMemberList = req.body.newMemberList;
    console.log(seasonCode);
    console.log(newMemberList);

    var checkOverlapMember = function (idx) {
        var index = idx;

        return function (callback) {
            var stmt = 'SELECT * FROM honorscloset.member WHERE Season = ? AND Name = ? AND Department = ?;'
            var param = [3];
            param[0] = seasonCode;
            param[1] = newMemberList[index].name;
            param[2] = newMemberList[index].department;

            conn.query(stmt, param, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    callback('err', {
                        index: index,
                        isExist: -1
                    });
                } else {
                    if (results.length > 0) {
                        callback(null, {
                            index: index,
                            isExist: 1
                        });
                    } else {
                        callback(null, {
                            index: index,
                            isExist: 0
                        });
                    }
                }
            });
        }
    }

    var parallelFuncList = [];
    for (var i = 0; i < newMemberList.length; i++) {
        parallelFuncList.push(checkOverlapMember(i));
    }

    async.parallel(
        parallelFuncList,
        function (err, results) {
            if (err) {
                console.log(results);
                res.json('err');
            } else {
                console.log(results);
                var isExistMemberIdx = results.filter((x) => (x.isExist == 1));
                res.json(isExistMemberIdx);
            }
        });
});

router.post('/insertMember', function (req, res) {
    console.log('POST MemberCut/insertMember 호출됨');
    var seasonCode = req.body.seasonCode;
    var newMemberList = req.body.newMemberList;
    console.log(seasonCode);
    console.log(newMemberList);

    var realImgFiles = [];
    var filter = /\.jpg$/;

    var files = null;

    var dir = './HonorsCloset/src/member/' + seasonCode;
    mkdirp(dir, function (err) {
        if (err) {
            console.error(err);
            res.json('err');
        } else {
            var files = fs.readdirSync(dir, function (err) {
                console.log('err');
                res.json('err');
            });
            for (var i = 0; i < files.length; i++) {
                var filename = files[i].match(/([^\/]*).jpg/)[1];
                realImgFiles.push(filename);
            }
            var index1 = 0;
            if (realImgFiles != undefined && realImgFiles != null && realImgFiles.length != 0) {
                var lastIndex = realImgFiles.length - 1;
                var lastName = realImgFiles[lastIndex];
                index1 = Number(lastName) + 1;
            }

            var insertMember = function (idx, filePath_) {
                var index = idx;
                var filePath = filePath_;

                return function (callback) {
                    var stmt = 'INSERT INTO honorscloset.member (Season, Name, Department, Image) VALUES (?, ?, ?, ?);'
                    var param = [4];
                    param[0] = seasonCode;
                    param[1] = newMemberList[index].name;
                    param[2] = newMemberList[index].department;
                    param[3] = filePath;

                    conn.query(stmt, param, function (error, results, fields) {
                        if (error) {
                            callback('err', index + ' : err');
                        } else {
                            callback(null, index + ' : success');
                        }
                    });
                }
            }

            var parallelFuncList = [];
            for (var i = 0; i < newMemberList.length; i++) {
                var filePath = '../src/member/' + seasonCode + '/' + ((index1 < 10) ? '0' + String(index1++) : String(index1++)) + '.jpg';
                parallelFuncList.push(insertMember(i, filePath));
            }

            async.parallel(
                parallelFuncList,
                function (err, results) {
                    if (err) {
                        console.log(results);
                        res.json('err');
                    } else {
                        console.log(results);
                        res.json('success');
                    }
                });
        }
    });
});

router.post('/insertImg/:seasonCode/:cnt', function (req, res) {
    console.log('POST MemberCut/insertImg/:seasonCode/:cnt 호출됨');
    var seasonCode = req.params.seasonCode;
    var cnt = req.params.cnt;
    console.log(seasonCode);
    console.log(cnt);

    var dir = './HonorsCloset/src/member/' + seasonCode;
    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });

    var realImgFiles = [];
    var filter = /\.jpg$/;

    var files = fs.readdirSync(dir);
    console.log(files);
    for (var i = 0; i < files.length; i++) {
        var filename = files[i].match(/([^\/]*).jpg/)[1];
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
            var dir = './HonorsCloset/src/member/' + seasonCode;
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
    });

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


router.post('/deleteMemberCut', function (req, res) {
    console.log("/MemberCut/deleteMemberCut 호출됨");

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

    var stmt = 'DELETE FROM honorscloset.member WHERE Season = ?;'
    var param = [1];
    param[0] = seasonCode;
    conn.query(stmt, param, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send('err');
        } else {
            var dirPath = './HonorsCloset/src/member/' + seasonCode;
            console.log(dirPath);
            deleteFolderRecursive(dirPath);

            var stmt = 'DELETE FROM honorscloset.season WHERE Season = ?;'
            var param = [1];
            param[0] = seasonCode;
            conn.query(stmt, param, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.send('err');
                } else {
                    res.send('success');
                }
            });
        }
    });
});

router.post('/insertMemberCut', function (req, res) {
    console.log("/Member/insertMemberCut 호출됨");
    var yearText = req.body.yearText;
    console.log(yearText);
    var seasonType = req.body.seasonType;
    console.log(seasonType);
    var seasonCode = yearText.substring(2, 4) + '-' + seasonType;
    console.log(seasonCode);

    async.waterfall([
        function (callback) {
                var stmt = 'SELECT * FROM honorscloset.season WHERE Season = ?;';
                var param = [1];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        callback(err);
                    } else {
                        if (rows.length >= 1)
                            callback('이미 존재하는 멤버컷 시즌입니다');
                        else
                            callback(null);
                    }
                });
        },
        function (callback) {
                var stmt = 'INSERT INTO honorscloset.season (Season) VALUES (?);';
                var param = [1];
                param[0] = seasonCode;
                conn.query(stmt, param, function (err, rows, fields, next) {
                    if (err) {
                        console.log(err);
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
