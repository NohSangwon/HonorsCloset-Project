const express = require('express');
const createDBConnection = require('./createDBConnection');
const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');
const async = require('async');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();


router.post('/insert/:Code/:Specification/:RegistDate/:FirstPrice/:LastPrice', function(req, res, next) {
    console.log('POST addProduct/insert 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Code = req.params.Code;
    var Specification = req.params.Specification;
    var RegistDate = req.params.RegistDate;
    var FirstPrice = req.params.FirstPrice;
    var LastPrice = req.params.LastPrice;
    var _extension = ['','','','',''];

    var dir = './HonorsCloset/src/product/' + Code;
    mkdirp(dir, function (err) {
        if (err)
            console.error(err);
    });

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
          var Fieldname = file.fieldname;
          var extension = path.extname(file.originalname);
          var No = '';
          if(Fieldname == 'Thumbnail'){
            _extension[0] = extension;
            No = 0;
          }
          else if(Fieldname == 'Image1'){
            _extension[1] = extension;
            No = 1;
          }
          else if(Fieldname == 'Image2'){
            _extension[2] = extension;
            No = 2;
          }
          else if(Fieldname == 'Image3'){
            _extension[3] = extension;
            No = 3;
          }
          else if(Fieldname == 'Image4'){
            _extension[4] = extension;
            No = 4;
          }
          else{
            return;
          }

          cb(null, Code + '-' + No + extension);
        }
    })

    var upload = multer({
      storage : storage
    })

    upload.fields([{name:'Thumbnail'},{name:'Image1'},{name:'Image2'},{name:'Image3'},{name:'Image4'}])(req, res, function (err) {
        if (err) {
            return;
        }

        var ImagePath = ['','','','','']
        if(req.files['Thumbnail'] != undefined || req.files['Thumbnail'] != null){
          ImagePath[0] = '../src/product/' + Code + '/' + Code + '-0' + _extension[0]
        }
        if(req.files['Image1'] != undefined || req.files['Image1'] != null){
          ImagePath[1] = '../src/product/' + Code + '/' + Code + '-1' + _extension[1];
        }
        if(req.files['Image2'] != undefined || req.files['Image2'] != null){
          ImagePath[2] = '../src/product/' + Code + '/' + Code + '-2' + _extension[2];
        }
        if(req.files['Image3'] != undefined || req.files['Image3'] != null){
          ImagePath[3] = '../src/product/' + Code + '/' + Code + '-3' + _extension[3];
        }
        if(req.files['Image4'] != undefined || req.files['Image4'] != null){
          ImagePath[4] = '../src/product/' + Code + '/' + Code + '-4' + _extension[4];
        }

        var stmt = 'INSERT INTO product VALUES (?,?,NULL,?,?,"0",?,"0",NULL,NULL,?,?,?,?,?,NULL,"0",NULL,"0","0");' ;

        conn.query(stmt,[Code,Specification,RegistDate,FirstPrice,LastPrice,ImagePath[0],ImagePath[1],ImagePath[2],ImagePath[3],ImagePath[4]] , function (err, rows, fields) {
            if (err) {
              console.log(err);
            } else {
              res.json('success');
            }
        });
    })

});

router.post('/xlsx', function (req, res, next) {
    console.log('POST addProducts/xlsx 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }
    var xlsxData = req.body.xlsxData;
    var labels = req.body.labels;
    var datas = req.body.datas;

    var insertProduct = function (idx) {
        var index = idx;

        return function (callback) {
            var code = String(datas[index][labels[0]]);

            var dir = '/src/product/' + code;
            var Thumbnnail_Path = dir + '/' + code + '-0.jpg';
            var Image1_Path = dir + '/' + code + '-1.jpg';
            var Image2_Path = dir + '/' + code + '-2.jpg';
            var Image3_Path = dir + '/' + code + '-3.jpg';
            var Image4_Path = dir + '/' + code + '-4.jpg';

            var stmt = 'INSERT INTO product VALUES (?, ?, NULL, ?, ?, "0", ?, "0", NULL, NULL, ?, ?, ?, ?, ?,"", "0",NULL,"0","0");';
            // (Code, Specification, RegistDate, Info, FirstPrice, DiscountRate, LastPrice, Progress, Seller_ID, Buyer_ID, Image1, Image2, Image3, Image4, Thumbnail, hit)
            var param = [10];
            param[0] = code; // Code
            param[1] = code[0]; // Specification ex) "AFB001" [0] = B : 하의
            param[2] = datas[index][labels[2]]; // RegistDate
            param[3] = datas[index][labels[1]]; // FirstPrice
            param[4] = datas[index][labels[1]]; // LastPrice
            param[5] = Thumbnnail_Path; // Image1
            param[6] = Image1_Path; // Image2
            param[7] = Image2_Path; // Image3
            param[8] = Image3_Path; // Image4
            param[9] = Image4_Path// Thumbnail

            conn.query(stmt, param, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    callback(null, {
                        targetId: String(datas[index][labels[0]]) + String(index),
                        result: 'error!'
                    });
                } else {
                    callback(null, {
                        targetId: String(datas[index][labels[0]]) + String(index),
                        result: 'success'
                    });
                }
            });
        }
    }

    var parallelFuncList = [];
    for (var i = 0; i < datas.length; i++) {
        parallelFuncList.push(insertProduct(i));
    }

    async.parallel(
        parallelFuncList,
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        }
    );
});

module.exports = router;
