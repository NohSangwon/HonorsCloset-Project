const express = require('express');
const multer = require("multer");
const path = require('path');

const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');

const ttfInfo = require('ttfinfo');
var ttf2woff = require('./js/ttf2woff.js');

var router = express.Router();

router.post('/getFontFileList', function (req, res, next) {
    var fontFiles = new Object();
    fontFiles.currFont = null;
    fontFiles.fontList = [];
    var getFontFileInfo = function (fileN) {
        var filename = fileN;
        return function (callback) {
            var filePath = './' + filename.replace(/\\/g, '/');
            var fileName = filePath.match(/\/([^\/]+).ttf/)[1];

            var fontFile = new Object();
            fontFile.filePath = filePath;
            fontFile.fileName = fileName;

            if (fontFile.fileName == 'currFont')
                fontFiles.currFont = fontFile;
            else
                fontFiles.fontList.push(fontFile);

            ttfInfo(filePath, function (err, info) {
                if (info == null || info == undefined)
                    fontFile.title = fileName;
                else
                    fontFile.title = info.tables.name['6'];
                callback(null, fontFile);
            });
        }
    }

    var parallelFuncList = [];
    var startPath = './HonorsCloset/src/font';
    var filter = /\.ttf$/
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        res.json("no dir ");
    } else {
        var files = fs.readdirSync(startPath);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startPath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                continue;
            } else if (filter.test(filename)) {
                parallelFuncList.push(getFontFileInfo(filename));
            }
        };

        async.parallel(
            parallelFuncList,
            function (err, results) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    res.json(fontFiles);
                }
            }
        );
    }
});

router.post('/insertFont', function (req, res, next) {
    console.log('POST Setting/insertFont 호출됨');

    var dir = './HonorsCloset/src/font';
    console.log(dir);
    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            console.log(file.originalname);
            cb(null, file.originalname);
        }
    })

    // 1. 미들웨어 등록
    let upload = multer({
        storage: storage
    });

    upload.single('fontFile')(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send('err');
        } else {
            var originalname = req.file.originalname.slice(0, -4);

            var input = fs.readFileSync('./HonorsCloset/src/font/' + originalname + '.ttf');
            var ttf = new Uint8Array(input);
            //var ttf = Array.prototype.slice.call(input, 0);
            var woff = new Buffer(ttf2woff(ttf).buffer);
            fs.writeFileSync('./HonorsCloset/src/font/' + originalname + '.woff', woff);

            var data = '@font-face { font-family: ' + originalname + '; src: url(' + originalname + '.ttf); src: url(' + originalname + '.woff); }\n'
            fs.appendFile('./HonorsCloset/src/font/fontList.css', data, 'utf8', function (err) {
                if (err) {
                    console.log('err');
                    res.send('err');
                } else {
                    console.log('success');
                    res.send('success');
                }
            });
        }
    });
});

router.post('/updateFont', function (req, res, next) {
    console.log('POST Setting/updateFont 호출됨');

    var fontFile = req.body.fontFile;
    console.log(fontFile);
    fs.copyFile('./HonorsCloset/src/font/' + fontFile.fileName + '.ttf', './HonorsCloset/src/font/currFont.ttf', function (error) {
        if (error) {
            console.log(error);
            res.json('err');
        } else {
            fs.copyFile('./HonorsCloset/src/font/' + fontFile.fileName + '.woff', './HonorsCloset/src/font/currFont.woff', function (error) {
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

router.post('/updateLogo', function (req, res, next) {
    console.log('POST Setting/updateLogo 호출됨');

    var dir = './HonorsCloset/src/logo';
    var logoFileName = 'logo.jpg';
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

    upload.single('logoImg')(req, res, function (err) {
        if (err) {
            res.send('err');
        } else {
            res.send('success');
        }
    });
});

router.post('/updateMainCut/:num', function (req, res, next) {
    console.log('POST Setting/updateMainCut 호출됨');
    var num = req.params.num;

    var dir = './HonorsCloset/src/maincut';
    var mainCutFileName = 'maincut.jpg';
    if (num == '1') {
        mainCutFileName = 'maincut.jpg';
    } else {
        mainCutFileName = 'maincut2.jpg';
    }

    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, mainCutFileName);
        }
    })

    // 1. 미들웨어 등록
    let upload = multer({
        storage: storage
    });

    upload.single('mainCutImg')(req, res, function (err) {
        if (err) {
            res.send('err');
        } else {
            res.send('success');
        }
    });
});

router.post('/updateMobileMainCut/:num', function (req, res, next) {
    console.log('POST Setting/updateMobileMainCut 호출됨');
    var num = req.params.num;

    var dir = './HonorsCloset/src/maincut';
    var mainCutFileName = 'maincut_m_man.jpg';
    if (num == '1') {
        mainCutFileName = 'maincut_m_man.jpg';
    } else {
        mainCutFileName = 'maincut_m_woman.jpg';
    }

    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, mainCutFileName);
        }
    })

    // 1. 미들웨어 등록
    let upload = multer({
        storage: storage
    });

    upload.single('mobileMainCutImg')(req, res, function (err) {
        if (err) {
            res.send('err');
        } else {
            res.send('success');
        }
    });
});

router.post('/getPayGuideMessage', function (req, res, next) {
    console.log('POST Setting/getPayGuideMessage 호출됨');
    var guideMessage = fs.readFileSync('./HonorsCloset/src/payguidemessage/payguidemessage.txt');
    console.log(guideMessage);
    res.send(guideMessage);
});

router.post('/updatePayGuideMessage', function (req, res, next) {
    console.log('POST Setting/updatePayGuideMessage 호출됨');
    var guideMessage = req.body.guideMessage;

    fs.writeFileSync('./HonorsCloset/src/payguidemessage/payguidemessage.txt', guideMessage);
    console.log(guideMessage);
    res.send('success');
});

router.post('/getDonatorList', function (req, res, next) {
    console.log('POST Setting/getDonatorList 호출됨');
    var donatorList = fs.readFileSync('./HonorsCloset/src/donatorList/donatorList.txt');
    console.log(donatorList);
    res.send(donatorList);
});

router.post('/updateDonatorList', function (req, res, next) {
    console.log('POST Setting/updateDonatorList 호출됨');
    var donatorList = req.body.donatorList;

    fs.writeFileSync('./HonorsCloset/src/donatorList/donatorList.txt', donatorList);
    console.log(donatorList);
    res.send('success');
});

module.exports = router;
