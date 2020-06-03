const express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('GET index 호출됨');

    res.sendfile('./HonorsCloset/index.html');
});

router.get('/index', function (req, res, next) {
    console.log('GET index 호출됨');

    res.sendfile('./HonorsCloset/index.html');
});

router.get('/19F-behindcut', function (req, res, next) {
    console.log('GET 19F-behindcut 호출됨');
    console.log(req.session);
    
    res.sendfile('./HonorsCloset/19F-behindcut.html');
});

router.get('/19F-collection', function (req, res, next) {
    console.log('GET 19F-collection 호출됨');

    res.sendfile('./HonorsCloset/19F-collection.html');
});

router.get('/19S-behindcut', function (req, res, next) {
    console.log('GET 19S-behindcut 호출됨');

    res.sendfile('./HonorsCloset/19S-behindcut.html');
});

router.get('/article', function (req, res, next) {
    console.log('GET article 호출됨');

    res.sendfile('./HonorsCloset/article.html');
});

router.get('/donator', function (req, res, next) {
    console.log('GET donator 호출됨');

    res.sendfile('./HonorsCloset/donator.html');
});

router.get('/faq', function (req, res, next) {
    console.log('GET faq 호출됨');

    res.sendfile('./HonorsCloset/faq.html');
});

router.get('/ID&PWD', function (req, res, next) {
    console.log('GET ID&PWD 호출됨');

    res.sendfile('./HonorsCloset/ID&PWD.html');
});

router.get('/leave', function (req, res, next) {
    console.log('GET leave 호출됨');

    res.sendfile('./HonorsCloset/leave.html');
});

router.get('/mypage', function (req, res, next) {
    console.log('GET mypage 호출됨');

    res.sendfile('./HonorsCloset/mypage.html');
});

router.get('/notice', function (req, res, next) {
    console.log('GET notice 호출됨');

    res.sendfile('./HonorsCloset/notice.html');
});

router.get('/noticedetail', function (req, res, next) {
    console.log('GET noticedetail 호출됨');

    res.sendfile('./HonorsCloset/noticedetail.html');
});

router.get('/product', function (req, res, next) {
    console.log('GET product 호출됨');

    res.sendfile('./HonorsCloset/product.html');
});

router.get('/Receipt', function (req, res, next) {
    console.log('GET Receipt 호출됨');

    res.sendfile('./HonorsCloset/Receipt.html');
});

router.get('/review', function (req, res, next) {
    console.log('GET review 호출됨');

    res.sendfile('./HonorsCloset/review.html');
});

router.get('/sign', function (req, res, next) {
    console.log('GET sign 호출됨');

    res.sendfile('./HonorsCloset/sign.html');
});

module.exports = router;
