const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();



router.post('/basket', function (req, res, next) {
    console.log('POST getBasket/basket/ 호출됨');
    var ID = req.session.user.ID;

    var stmt = 'SELECT Customer_ID, Product_Code, Thumbnail, Info, LastPrice FROM cart JOIN product WHERE product.Code = cart.Product_Code AND Customer_ID=?;';
    
    conn.query(stmt, ID, function (err, rows, fields) {
        if (err) {
            console.log('db error');
        } else {
            res.json(rows);
        }
    });
});


module.exports = router;