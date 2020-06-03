const express = require('express');
const createDBConnection = require('./createDBConnection');
const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');
const checkADMIN = ('./checkADMIN');

var conn = createDBConnection();

var router = express.Router();

router.post('/DiscountRate', function(req, res, next) {
    console.log('POST updateProducts/DiscountRate 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var stmt = "";
    var Code = req.body.Code;
    var DiscountRate = req.body.DiscountRate;
    var LastPrice = req.body.LastPrice;
    var Update_Code = Code.split(',');
    var Update_LastPrice = LastPrice.split(',');

    for(var i = 0; i < Update_LastPrice.length-1 ; i++){
      Update_LastPrice[i] = Number(Update_LastPrice[i]) * (1-DiscountRate);
    }

    for(var i = 0 ; i < Update_Code.length-1 ; i++){
      stmt += 'UPDATE product SET DiscountRate = ' + DiscountRate + ', LastPrice = ' + Update_LastPrice[i] + ' WHERE code = "' + Update_Code[i] + '";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            res.send({msg:"Success"});
        }
    });
});

router.post('/DiscountSpecial', function(req, res, next) {
    console.log('POST updateProducts/DiscountSpecial 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var stmt = "";
    var Code = req.body.Code;
    var DiscountRate = req.body.DiscountRate;
    var LastPrice = req.body.LastPrice;
    var Update_Code = Code.split(',');
    var Update_DiscountRate = DiscountRate.split(',');

    for(var i = 0 ; i < Update_Code.length-1 ; i++){
      stmt += 'UPDATE product SET DiscountRate = ' + Update_DiscountRate[i] + ', LastPrice = ' + LastPrice + ' WHERE code = "' + Update_Code[i] + '";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            res.send({msg:"Success"});
        }
    });
});

router.post('/Loss', function(req, res, next) {
    console.log('POST updateProducts/Loss 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    /* Date Padding Function */
    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }

    var stmt = "";
    var Code = req.body.Code;
    var Update_Code = Code.split(',');
    var LossDay = new Date();
    LossDay = LossDay.getFullYear() + '' + pad((LossDay.getMonth()+1)) + '' + pad(LossDay.getDate()) + '';

    for(var i = 0 ; i < Update_Code.length-1 ; i++){
      stmt += 'UPDATE product SET Progress = "4", LossDate = ' + LossDay + ' WHERE code = "' + Update_Code[i] + '";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            res.send({msg:"Success"});
        }
    });
});

router.post('/Update/:Code/:RegistDate/:FirstPrice/:LastPrice/:Thumbnail/:Image1/:Image2/:Image3/:Image4', function(req, res, next) {
    console.log('POST updateProducts/Update 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var Code = req.params.Code;
    var RegistDate = req.params.RegistDate;
    var FirstPrice = req.params.FirstPrice;
    var LastPrice = req.params.LastPrice;
    var _extension = ['','','','',''];
    var params = [RegistDate,FirstPrice,LastPrice];

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

        if(req.files['Thumbnail'] != undefined || req.files['Thumbnail'] != null){
          params[3] = '/src/product/' + Code + '/' + Code + '-0' + _extension[0]
        }
        else{
          var Thumbnail = req.params.Thumbnail;
          if(Thumbnail != '파일 없음'){
            params[3] = '/src/product/' + Code + '/' + Thumbnail;
          }
          else{
            params[3] = '';
          }
        }
        if(req.files['Image1'] != undefined || req.files['Image1'] != null){
          params[4] = '/src/product/' + Code + '/' + Code + '-1' + _extension[1];
        }
        else{
          var Image1 = req.params.Image1;
          if(Image1 != '파일 없음'){
            params[4] = '/src/product/' + Code + '/' + Image1;
          }
          else{
            params[4] = '';
          }
        }
        if(req.files['Image2'] != undefined || req.files['Image2'] != null){
          params[5] = '/src/product/' + Code + '/' + Code + '-2' + _extension[2];
        }
        else{
          var Image2 = req.params.Image2;
          if(Image2 != '파일 없음'){
            params[5] = '/src/product/' + Code + '/' + Image2;
          }
          else{
            params[5] = '';
          }

        }
        if(req.files['Image3'] != undefined || req.files['Image3'] != null){
          params[6] = '/src/product/' + Code + '/' + Code + '-3' + _extension[3];
        }
        else{
          var Image3 = req.params.Image3;
          if(Image3 != '파일 없음'){
            params[6] = '/src/product/' + Code + '/' + Image3;
          }
          else{
            params[6] = '';
          }
        }
        if(req.files['Image4'] != undefined || req.files['Image4'] != null){
          params[7] = '/src/product/' + Code + '/' + Code + '-4' + _extension[4];
        }
        else{
          var Image4 = req.params.Image4;
          if(Image4 != '파일 없음'){
            params[7] = '/src/product/' + Code + '/' + Image4;
          }
          else{
            params[7] = '';
          }
        }

        var stmt = 'Update honorscloset.product SET RegistDate = ?, FirstPrice = ?, DiscountRate = 0, LastPrice = ?, Thumbnail = ?, Image1 = ?, Image2 = ?, Image3 = ?, Image4 = ? WHERE Code = "' + Code + '";';

        conn.query(stmt, params , function (err, rows, fields) {
            if (err) {
              console.log(err);
            } else {
              console.log('ok');
              res.json('ok');
            }
        });
    })
});

router.post('/toOffline', function(req, res, next) {
    console.log('POST updateProducts/DiscountRate 호출됨');
    if(checkADMIN == '-9999'){
      return;
    }

    var stmt = "";
    var Code = req.body.Code;
    var Update_Code = Code.split(',');

    for(var i = 0 ; i < Update_Code.length-1 ; i++){
      stmt += 'UPDATE product SET Progress = "1" WHERE code = "' + Update_Code[i] + '";';
    }

    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            res.send({msg:"Success"});
        }
    });
});

module.exports = router;
