const express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('GET admin/index_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/index_ADMIN.html');
});

router.get('/index_ADMIN', function (req, res, next) {
    console.log('GET admin/index_ADMIN 호출됨');
    console.log(req.session);

    res.sendfile('./HonorsCloset/admin/index_ADMIN.html');
});

router.get('/Stock_add', function (req, res, next) {
    console.log('GET admin/Stock_add 호출됨');

    res.sendfile('./HonorsCloset/admin/Stock_add.html');
});

router.get('/Stock', function (req, res, next) {
    console.log('GET admin/Stock 호출됨');

    res.sendfile('./HonorsCloset/admin/Stock.html');
});

router.get('/Stock_UnSelled', function (req, res, next) {
    console.log('GET admin/Stock_UnSelled 호출됨');

    res.sendfile('./HonorsCloset/admin/Stock_UnSelled.html');
});

router.get('/ProductInfo', function (req, res, next) {
    console.log('GET admin/ProductInfo 호출됨');

    res.sendfile('./HonorsCloset/admin/ProductInfo.html');
});

router.get('/Stock_xlsx_add', function (req, res, next) {
    console.log('GET admin/Stock_xlsx_add 호출됨');

    res.sendfile('./HonorsCloset/admin/Stock_xlsx_add.html');
});

router.get('/Calculate', function (req, res, next) {
    console.log('GET admin/Calculate 호출됨');

    res.sendfile('./HonorsCloset/admin/Calculate.html');
});

router.get('/Calculate_Detail', function (req, res, next) {
    console.log('GET admin/Calculate_Detail 호출됨');

    res.sendfile('./HonorsCloset/admin/Calculate_Detail.html');
});

router.get('/Member', function (req, res, next) {
    console.log('GET admin/Member 호출됨');

    res.sendfile('./HonorsCloset/admin/Member.html');
});

router.get('/donatorManage', function (req, res, next) {
    console.log('GET admin/donatorManage 호출됨');

    res.sendfile('./HonorsCloset/admin/donatorManage.html');
});

router.get('/Statics_SignUp', function (req, res, next) {
    console.log('GET admin/Statics_SignUp 호출됨');

    res.sendfile('./HonorsCloset/admin/Statics_SignUp.html');
});

router.get('/Statics_ProductHit', function (req, res, next) {
    console.log('GET admin/Statics_ProductHit 호출됨');

    res.sendfile('./HonorsCloset/admin/Statics_ProductHit.html');
});

router.get('/notice_ADMIN', function (req, res, next) {
    console.log('GET admin/notice_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/notice_ADMIN.html');
});

router.get('/noticeDetail_ADMIN', function (req, res, next) {
    console.log('GET admin/notice_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/noticeDetail_ADMIN.html');
});

router.get('/FAQ_ADMIN', function (req, res, next) {
    console.log('GET admin/FAQ_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/FAQ_ADMIN.html');
});

router.get('/FAQDetail_ADMIN', function (req, res, next) {
    console.log('GET admin/FAQDetail_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/FAQDetail_ADMIN.html');
});

router.get('/BoardUpdate', function (req, res, next) {
    console.log('GET admin/BoardUpdate 호출됨');

    res.sendfile('./HonorsCloset/admin/BoardUpdate.html');
});

router.get('/review_ADMIN', function (req, res, next) {
    console.log('POST admin/review_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/review_ADMIN.html');
});

router.get('/reviewDetail_ADMIN', function (req, res, next) {
    console.log('POST admin/reviewDetail_ADMIN 호출됨');

    res.sendfile('./HonorsCloset/admin/reviewDetail_ADMIN.html');
});

router.get('/Article', function (req, res, next) {
    console.log('POST admin/Article 호출됨');

    res.sendfile('./HonorsCloset/admin/Article.html');
});

router.get('/Article_Detail', function (req, res, next) {
    console.log('POST admin/Article_Detail 호출됨');

    res.sendfile('./HonorsCloset/admin/Article_Detail.html');
});

router.get('/Lookbook', function (req, res, next) {
    console.log('POST admin/Lookbook 호출됨');

    res.sendfile('./HonorsCloset/admin/Lookbook.html');
});

router.get('/Lookbook_Detail', function (req, res, next) {
    console.log('POST admin/Lookbook_Detail 호출됨');

    res.sendfile('./HonorsCloset/admin/Lookbook_Detail.html');
});

router.get('/Behindcut', function (req, res, next) {
    console.log('POST admin/Behindcut 호출됨');

    res.sendfile('./HonorsCloset/admin/Behindcut.html');
});

router.get('/Behindcut_Detail', function (req, res, next) {
    console.log('POST admin/Behindcut_Detail 호출됨');

    res.sendfile('./HonorsCloset/admin/Behindcut_Detail.html');
});

router.get('/MemberCut', function (req, res, next) {
    console.log('POST admin/MemberCut 호출됨');

    res.sendfile('./HonorsCloset/admin/MemberCut.html');
});

router.get('/MemberCut_Detail', function (req, res, next) {
    console.log('POST admin/MemberCut_Detail 호출됨');

    res.sendfile('./HonorsCloset/admin/MemberCut_Detail.html');
});

router.get('/Sell_sell', function (req, res, next) {
    console.log('GET admin/Sell_sell 호출됨');

    res.sendfile('./HonorsCloset/admin/Sell_sell.html');
    res.sendfile
});

router.get('/Sell_sellHistory', function (req, res, next) {
    console.log('GET admin/Sell_sellHistory 호출됨');

    res.sendfile('./HonorsCloset/admin/Sell_sellHistory.html');
});

router.get('/Sell_orderHistory', function (req, res, next) {
    console.log('GET admin/Sell_orderHistory 호출됨');

    res.sendfile('./HonorsCloset/admin/Sell_orderHistory.html');
});

router.get('/Settings', function (req, res, next) {
    console.log('GET admin/Statics 호출됨');

    res.sendfile('./HonorsCloset/admin/Settings.html');
});

module.exports = router;
