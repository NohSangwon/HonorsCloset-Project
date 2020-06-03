const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();



router.post('/order', function (req, res, next) {
    console.log('POST getOrderCheck/order/ 호출됨');
    var ID = req.session.user.ID;

    var stmt = "SELECT * FROM honorscloset.order, honorscloset.orderedproduct, honorscloset.product WHERE orderedproduct.Order_No=order.No AND orderedproduct.Product_Code=product.Code AND Customer_ID = ? AND isCanceled='0'";
    
    conn.query(stmt, ID, function (err, rows, fields) {
        if (err) {
            console.log('db error');
        } else {
            res.json(rows);
        }
    });
});


module.exports = router;