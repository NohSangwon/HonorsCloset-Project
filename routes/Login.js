const express = require('express');
var session = require('express-session');
const createDBConnection = require('./createDBConnection');
const nodemailer = require('nodemailer');
var conn = createDBConnection();
var app = express();
var router = express.Router();
const moment = require('moment');

// Login Module
router.get('/logindone', function (req, res) {
    if (req.session.user) {
        res.redirect('/mypage.html');
    } else {
        res.redirect('/login.html');
    }
})

router.post('/DoLogin', function (req, res) {
    var uname = req.body.id;
    var pwd = req.body.pwd;
    conn.query('SELECT * FROM honorscloset.customer WHERE ID = ? AND Password = ?', [uname, pwd], function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            if (results[0] == null) {
                res.json('err1');
            } else if(results[0].isWithdrawal == '1'){
              res.json('err3');
            } else if (results[0].isCertificated == null) {
                res.json('err2');
            } else if (results[0].Password == pwd) {
                req.session.user = {
                    'ID': uname,
                    'Spec': results[0].Specification
                }
                res.json('success');
            }
        }
    });
});

app.get('/auth/check', function (req, res, next) {
    let email = req.query.email;
    let token = req.query.token;

    var checkNumber;
    conn.query('SELECT * FROM honorscloset.customer WHERE ID = ?', [email], function (error, results, fields) {

        checkNumber = results[0].CertificationNum;
        if (token === checkNumber) {
            console.log('회원가입 완료 !!!')
        }
    });
    // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
})



router.post('/sign/:id/:password/:password2/:name/:phone/:birth', function (req, res) {
    var id = req.params.id;
    var pwd = req.params.password;
    var pwd2 = req.params.password2;
    var name = req.params.name;
    var phone = req.params.phone;
    var birth = req.params.birth;
    var registDate = moment().format("YYYYMMDD");

    var number = Math.floor(Math.random() * 10000) + 1;


    conn.query('INSERT INTO honorscloset.customer (ID, Password, Name, PhoneNum,E_mail,Birth,CertificationNum, RegistDate, isWithdrawal) VALUES(?, ?, ?, ?, ?, ?, '+number+', ?, "0")',
        [id, pwd, name, phone, id, birth, registDate],
        function (error, result) {
            if (error) {
                throw error;
            }
            console.log("회원가입 성공 !");
        })


    var go = id;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "login",
            user: 'bluecheesekit@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'HY891212'          // gmail 계정의 비밀번호를 입력
        }
    });

    let mailOptions = {
        from: 'bluecheesekit@gmail.com',
        to: go,
        subject: '안녕하세요, 명예옷장 입니다. 이메일 인증을 해주세요.',
        html: '<p>아래의 링크를 클릭해주세요 !</p>' +
            "<a href='http://localhost/Login/auth/check?email=" + id + "&token=" + number + "'> 명예 옷장 회원 가입 인증하기</a>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect('/sendMail.html');
});

router.get('/auth/logout', function (req, res) {

    delete req.session.user; //세션 삭제

    res.redirect('/');
});

router.get('/auth/check', function (req, res, next) {
    let email = req.query.email;
    let token = req.query.token;

    var checkNumber;
    conn.query('SELECT * FROM honorscloset.customer WHERE ID = ?', [email], function (error, results, fields) {

        checkNumber = results[0].CertificationNum;
        console.log(checkNumber);
        if (token === checkNumber) {
            conn.query('UPDATE honorscloset.customer SET isCertificated=1 WHERE ID = ?', [email],
                function (error, result) {
                    if (error) {
                        throw error;
                    }
                    res.redirect('/finish.html');
                })
        }


    });
    // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
})

router.post('/checkIsManager', function (req, res) {
    if (req.session.user == undefined || req.session.user == null)
        res.send('0')
    else if (req.session.user.Spec == '0')
        res.json('1');
    else
        res.json('0');
});

router.post('/checkDuplicateID', function (req, res) {
  console.log('/checkDuplicateID 접속')
  var id = req.body.id;
  console.log(id);

  conn.query('SELECT * FROM honorscloset.customer WHERE ID = ?', id, function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          if( results.length == 1){
            res.send('No');
          }
          else{
            res.send('YES');
          }
        }
  });
});

router.post('/findID', function (req, res) {
  console.log('/Login/findID 접속')
  var name = req.body.name;
  var birth = req.body.birth;

  conn.query('SELECT ID FROM honorscloset.customer WHERE Name = ? and Birth = ?', [name, birth], function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json(results);
        }
  });
});

router.post('/findPWD', function (req, res) {
  console.log('/Login/findPWD 접속')
  var id = req.body.id;
  var name = req.body.name;
  var birth = req.body.birth;

  conn.query('SELECT ID FROM honorscloset.customer WHERE ID = ? and Name = ? and Birth = ?', [id, name, birth], function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json(results);
        }
  });
});

router.post('/updatePWD', function (req, res) {
  console.log('/Login/updatePWD 접속')
  var id = req.body.id;
  var password = req.body.password;

  conn.query('UPDATE honorscloset.customer SET Password = ? WHERE ID = ?', [password, id], function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json({"msg":"OK"});
        }
  });
});

router.post('/loadCustomer', function (req, res) {
  console.log('/Login/loadCustomer 접속')
  var id = req.session.user.ID;
  console.log(id);

  conn.query('SELECT * FROM honorscloset.customer WHERE ID = ?', id, function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json(results);
        }
  });
});

router.post('/updateCustomer', function (req, res) {
  console.log('/Login/updateCustomer 접속')
  var id = req.body.id;
  var password = req.body.password;
  var number = req.body.number;
  var email = req.body.email;

  conn.query('UPDATE honorscloset.customer SET Password = ?, PhoneNum = ?, E_mail = ? WHERE ID = ?', [password, number, email, id], function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json({"msg":"OK"});
        }
  });
});

router.post('/Withdrawal', function (req, res) {
  console.log('/Login/Withdrawal 접속')
  var id = req.session.user.ID;

  conn.query('UPDATE honorscloset.customer SET isWithdrawal = "1" WHERE ID = ?', id, function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
          res.json({"msg":"OK"});
        }
  });
});

module.exports = router;
