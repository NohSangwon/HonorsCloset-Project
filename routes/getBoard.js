const express = require('express');
const createDBConnection = require('./createDBConnection');

var conn = createDBConnection();

var router = express.Router();

// Specification = "0" : 공지사항
// Specification = "1" : FAQ
// Specification = "2" : 리뷰

router.post('/FAQ/cnt', function (req, res, next) {
    console.log('POST getBoard/FAQ/cnt 호출됨');
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? ORDER BY No DESC;';
    var param = [1];
    param[0] = "1";
    if (option == 'title') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Title LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "1";
        param[1] = '%' + keyword + '%';
    } else if (option == 'content') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Contents LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "1";
        param[1] = '%' + keyword + '%';
    } else if (option == 'all') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC;';
        param = [3];
        param[0] = "1";
        param[1] = '%' + keyword + '%';
        param[2] = '%' + keyword + '%';
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/FAQ', function (req, res, next) {
    console.log('POST getBoard/FAQ/ 호출됨');
    var pageNum = Number(req.body.pageNum);
    var showNum = Number(req.body.showNum);
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="1" ORDER BY No DESC Limit ?, ?;';
    var param = [2];
    param[0] = 0 + showNum * (pageNum - 1); // 0 20 40
    param[1] = showNum; // 20
    if (option == 'title') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="1" AND Title LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'content') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="1" AND Contents LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'all') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="1" AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC Limit ?, ?;';
        param = [4];
        param[0] = '%' + keyword + '%';
        param[1] = '%' + keyword + '%';
        param[2] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[3] = showNum; // 20
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/FAQ/notice', function (req, res, next) {
    console.log('POST getBoard/FAQ/notice 호출됨');

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="1" AND isNotice="1" ORDER BY No DESC;';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

// 여기부터 공지사항

router.post('/Notice/cnt', function (req, res, next) {
    console.log('POST getBoard/Notice/cnt 호출됨');
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? ORDER BY No DESC;';
    var param = [1];
    param[0] = "0";
    if (option == 'title') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Title LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "0";
        param[1] = '%' + keyword + '%';
    } else if (option == 'content') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Contents LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "0";
        param[1] = '%' + keyword + '%';
    } else if (option == 'all') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC;';
        param = [3];
        param[0] = "0";
        param[1] = '%' + keyword + '%';
        param[2] = '%' + keyword + '%';
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/Notice', function (req, res, next) {
    console.log('POST getBoard/Notice 호출됨');
    var pageNum = Number(req.body.pageNum);
    var showNum = Number(req.body.showNum);
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="0" ORDER BY No DESC Limit ?, ?;';
    var param = [2];
    param[0] = 0 + showNum * (pageNum - 1); // 0 20 40
    param[1] = showNum; // 20
    if (option == 'title') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="0" AND Title LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'content') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="0" AND Contents LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'all') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="0" AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC Limit ?, ?;';
        param = [4];
        param[0] = '%' + keyword + '%';
        param[1] = '%' + keyword + '%';
        param[2] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[3] = showNum; // 20
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/Notice/notice', function (req, res, next) {
    console.log('POST getBoard/Notice/notice 호출됨');

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="0" AND isNotice="1" ORDER BY No DESC;';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

// 여기부터 리뷰게시판
router.post('/Review/cnt', function (req, res, next) {
    console.log('POST getBoard/Review/cnt 호출됨');
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? ORDER BY No DESC;';
    var param = [1];
    param[0] = "2";
    if (option == 'title') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Title LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "2";
        param[1] = '%' + keyword + '%';
    } else if (option == 'content') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND Contents LIKE ? ORDER BY No DESC;';
        param = [2];
        param[0] = "2";
        param[1] = '%' + keyword + '%';
    } else if (option == 'all') {
        stmt = 'SELECT count(*) as cnt FROM honorscloset.board WHERE Specification=? AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC;';
        param = [3];
        param[0] = "2";
        param[1] = '%' + keyword + '%';
        param[2] = '%' + keyword + '%';
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/Review', function (req, res, next) {
    console.log('POST getBoard/Review/ 호출됨');
    var pageNum = Number(req.body.pageNum);
    var showNum = Number(req.body.showNum);
    var option = req.body.option;
    var keyword = req.body.keyword;

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="2" ORDER BY No DESC Limit ?, ?;';
    var param = [2];
    param[0] = 0 + showNum * (pageNum - 1); // 0 20 40
    param[1] = showNum; // 20
    if (option == 'title') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="2" AND Title LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'content') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="2" AND Contents LIKE ? ORDER BY No DESC Limit ?, ?;';
        param = [3];
        param[0] = '%' + keyword + '%';
        param[1] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[2] = showNum; // 20
    } else if (option == 'all') {
        stmt = 'SELECT * FROM honorscloset.board WHERE Specification="2" AND (Title LIKE ? OR Contents LIKE ?) ORDER BY No DESC Limit ?, ?;';
        param = [4];
        param[0] = '%' + keyword + '%';
        param[1] = '%' + keyword + '%';
        param[2] = 0 + showNum * (pageNum - 1); // 0 20 40
        param[3] = showNum; // 20
    }
    conn.query(stmt, param, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/Review/notice', function (req, res, next) {
    console.log('POST getBoard/Review/notice 호출됨');

    var stmt = 'SELECT * FROM honorscloset.board WHERE Specification="2" AND isNotice="1" ORDER BY No DESC;';
    conn.query(stmt, function (err, rows, fields) {
        if (err) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

router.post('/Notice/getNoticeByNo', function(req,res,next){
  console.log('POST getBoard/Notice/getNoticeByNo 호출됨');

  var No = req.body.No;

  var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '0' AND No = ?";

  conn.query(stmt, No, function (err, rows, fields) {
      if (err) {
          console.log(error);
      } else {
          res.json(rows);
      }
  });
})

router.post('/FAQ/getFAQByNo', function(req,res,next){
  console.log('POST getBoard/FAQ/getFAQByNo 호출됨');

  var No = req.body.No;

  var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '1' AND No = ?";
  conn.query(stmt, No, function (err, rows, fields) {

      if (err) {
          console.log(error);
      } else {
          res.json(rows);
      }
  });
})

router.post('/Review/getReviewByNo', function(req,res,next){
  console.log('POST getBoard/Review/getReviewByNo 호출됨');

  var No = req.body.No;

  var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '2' AND No = ?";

  conn.query(stmt, No, function (err, rows, fields) {
      if (err) {
          console.log(error);
      } else {
          res.json(rows);
      }
  });
})

router.post('/Review/getReviewCount', function(req,res,next){
  console.log('POST getBoard/Review/getReviewCount 호출됨');

  var Start = req.body.Start;
  var End = req.body.End;

  var stmt = "SELECT count(*) as cnt FROM honorscloset.board WHERE Specification = '2' AND board.Date >= ? AND board.DATE <= ?";

  conn.query(stmt, [Start,End], function (err, rows, fields) {
      if (err) {
          console.log(error);
      } else {
          res.json(rows);
      }
  });
})

router.post('/Notice/getNoticeByNoClient', function (req, res, next) {
    console.log('POST getBoard/Notice/getNoticeByNoClient 호출됨');

    var No = req.body.No;

    var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '0' AND No = ?";

    conn.query("UPDATE board set Hit=Hit+1 WHERE Specification = '0' AND No = ?", No, function (err, rows) {
        if (err) {
            console.log('db error');
        } else {
            conn.query(stmt, No, function (err, rows, fields) {

                if (err) {
                    console.log('db error');
                } else {
                    res.json(rows);
                }
            });
        }
    });
})

router.post('/FAQ/getFAQByNoClient', function (req, res, next) {
    console.log('POST getBoard/FAQ/getFAQByNoClient 호출됨');

    var No = req.body.No;

    var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '1' AND No = ?";

    conn.query("UPDATE board set Hit=Hit+1 WHERE Specification = '1' AND No = ?", No, function (err, rows) {
        if (err) {
            console.log('db error');
        } else {
            conn.query(stmt, No, function (err, rows, fields) {

                if (err) {
                    console.log('db error');
                } else {
                    res.json(rows);
                }
            });
        }
    });
})

router.post('/Review/getReviewByNoClient', function (req, res, next) {
    console.log('POST getBoard/Review/getReviewByNoClient 호출됨');

    var No = req.body.No;

    var stmt = "SELECT * FROM honorscloset.board WHERE Specification = '2' AND No = ? ORDER BY No DESC";

    conn.query("UPDATE board set Hit=Hit+1 WHERE Specification = '2' AND No = ?", No, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            conn.query(stmt, No, function (err, rows, fields) {

                if (err) {
                    console.log('db error');
                } else {
                    res.json(rows);
                }
            });
        }
    });
})

// load Board - By No, Specification
router.post('/loadBoard', function (req, res, next) {
    console.log('POST getBoard/loadBoard 호출됨');

    var No = req.body.No;
    var Specification = req.body.Specification;

    var stmt = "SELECT * FROM honorscloset.board WHERE Specification = ? AND No = ?";

    conn.query(stmt, [Specification,No], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });

})

module.exports = router;
