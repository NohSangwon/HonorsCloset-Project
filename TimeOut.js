const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'kitsekle445',
    database: 'honorscloset',
    multipleStatements: true
});
conn.connect();

/* Date To String (2Hours Later) */
function dateToYYYYMMDDHHMMSS() {
    var date = new Date();

    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
}

function dateToString(date) {

    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }

    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
}

function OrderLimit(a){
  yyyy = a.substr(0,4);
  mm = a.substr(4,2);
  dd = a.substr(6,2);
  hh = a.substr(8,2);
  mi = a.substr(10,2);
  ss = a.substr(12,2);
  time = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mi+':'+ss;

  return new Date(Date.parse(new Date(time)) + 120000 * 60);
}

function a(){
  setTimeout(()=>{
    var Now = new Date();
    var CurrentHour = Now.getHours();
    if(CurrentHour > 8 && CurrentHour < 20){
      console.log('TimeOut Processing ...');
      /* First Query Bloack */
      conn.query('SELECT No, OrderDate FROM honorscloset.`order` WHERE SaleDate IS NULL AND isCanceled = "0"', function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        var Now = dateToYYYYMMDDHHMMSS();
        // 갯수만큼 반복
        for(var i = 0; i < rows.length ; i++){
          if(dateToString(OrderLimit(rows[i].OrderDate)) < Now){
            /* Second Query Block */
            conn.query('SELECT Product_Code FROM honorscloset.orderedproduct WHERE Order_No = ?', rows[i].No , function(err, rows2, fields){
              if(err){
              }
              else{
                /* Third Query Block */
                conn.query('UPDATE honorscloset.product SET Progress = "1", Buyer_ID = "" WHERE Code = ? AND Progress != "1"', rows2[0].Product_Code , function(err, rows3, fields){
                  if(err){
                  }
                  else{
                    console.log(rows2[0].Product_Code + ' Updated');
                  }
                })
                /* Third Query Block End */

              }
            })

            /* Fourth Query Block */
            conn.query('UPDATE honorscloset.order SET isCanceled = "1" WHERE No = ?', rows[i].No , function(err, rows4, fields){
              if(err){
              }
              else{
                console.log('ok');
                }
              })
            /* Fourth Query Block End */

          }
          /* Second Query End */
        }
      }
      })
      /* First Query End */
    }
    process.nextTick(a);
  },5000)
}

a();
