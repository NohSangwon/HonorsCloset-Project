const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');


var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var mysql = require('mysql');

var routes = require('./routes');
var getProductsRoutes = require('./routes/getProducts');
var addProductRoutes = require('./routes/addProduct');
var deleteProductsRoutes = require('./routes/deleteProducts');
var updateProductsRoutes = require('./routes/updateProducts');
var salesRoutes = require('./routes/sales');
var getOrdersRoutes = require('./routes/getOrders');
var loginRoutes = require('./routes/Login');
var noticeRoutes = require('./routes/Notice');
var reviewRoutes = require('./routes/Review');
var memberRoutes = require('./routes/Member');
var articleRoutes = require('./routes/Article');
var lookbookRoutes = require('./routes/Lookbook');
var behindCutRoutes = require('./routes/BehindCut');
var memberCutRoutes = require('./routes/MemberCut');
var donatorRoutes = require('./routes/Donator');
var boardRoutes = require('./routes/insertBoard');
var updateBoardRoutes = require('./routes/updateBoard');
var collectionRoutes = require('./routes/Collection');
var getBoardRoutes = require('./routes/getBoard');
var deleteBoardRoutes = require('./routes/deleteBoard');
var product_CLIENT_Routes = require('./routes/Product_CLIENT');
var adminRoutes = require('./routes/admin');
var staticsRoutes = require('./routes/Statics');
var settingRoutes = require('./routes/Setting');
var infoRoutes = require('./routes/Info');
var getBasketRoutes = require('./routes/getBasket');
var getInterestRoutes = require('./routes/getInterest');
var getOrderCheckRoutes = require('./routes/getOrderCheck');
var deleteBoardRoutes = require('./routes/deleteBoard');
var calculateRoutes = require('./routes/Calculate');

var app = express();
const port = 80;

//app.use(express.static(path.join(__dirname, 'HonorsCloset_ADMIN')));
app.set('port', port); // 웹 서버 포트
app.set('views', path.join(__dirname, 'views')); // 템플릿
app.set('view engine', 'pug'); // 템플릿 엔진
app.use(favicon(__dirname + '/public/favicon.ico')); // 파비콘
app.use(logger('dev')); // 로그 기록
app.use(bodyParser.json()); // 요청 본문 파싱
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride()); // 구식 브라우저 메소드 지원
app.use(session({
    secret:'*******',
    resave:false,
    saveUninitialized:true
  }));
app.use(express.static(path.join(__dirname, 'HonorsCloset')));

// Routing
app.use('/', routes);
app.use('/getProducts', getProductsRoutes);
app.use('/addProduct', addProductRoutes);
app.use('/deleteProducts', deleteProductsRoutes);
app.use('/updateProducts', updateProductsRoutes);
app.use('/Sales', salesRoutes);
app.use('/getOrders', getOrdersRoutes);
app.use('/Login', loginRoutes);
app.use('/Notice', noticeRoutes);
app.use('/Review', reviewRoutes);
app.use('/Member', memberRoutes);
app.use('/Article', articleRoutes);
app.use('/BehindCut', behindCutRoutes);
app.use('/Lookbook', lookbookRoutes);
app.use('/Donator', donatorRoutes);
app.use('/MemberCut', memberCutRoutes);
app.use('/insertBoard', boardRoutes);
app.use('/updateBoard', updateBoardRoutes);
app.use('/Collection', collectionRoutes);
app.use('/getBoard', getBoardRoutes);
app.use('/deleteBoard', deleteBoardRoutes);
app.use('/ProductCLIENT', product_CLIENT_Routes);
app.use('/admin', adminRoutes);
app.use('/Statics', staticsRoutes);
app.use('/Setting', settingRoutes);
app.use('/Info', infoRoutes);
app.use('/getBasket',getBasketRoutes);
app.use('/getInterest',getInterestRoutes);
app.use('/getOrderCheck',getOrderCheckRoutes);
app.use('/deleteBoard',deleteBoardRoutes);
app.use('/Calculate', calculateRoutes);

var server = app.listen(port, function() {
  console.log('Port No ( ' + port + ' ) Listening ...');
});
