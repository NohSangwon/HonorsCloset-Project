function initialiseGetData() {
  var getData = new Array();
  var urlStr = new String(window.location);
  urlStr = decodeURI(urlStr);
  var questionMarkLocation = urlStr.search(/\?/);
  if (questionMarkLocation != -1) {
    urlStr = urlStr.substr(questionMarkLocation + 1, urlStr.length);
    var getDataArray = urlStr.split(/&/g);
    for (var i = 0; i < getDataArray.length; i++) {
      getData[i] = getDataArray[i].split(/=/)[1];
    }
  }
  return getData;
}

var params = initialiseGetData();
var cnt = 0;
var SHOW_NUM = 10; // 한 페이지당 보여줄 게시물 갯수

function getSelledCnt() {
  var param = new Object();

  $.ajax({
    type: "POST",
    url: '/getProducts/SelledCount',
    async: false,
    data: param,
    success: function (data) {
      cnt = data[0].cnt;
      console.log(cnt);
    },
    error: function (e) {
      alert(e.responseText);
    }
  });
}

function refreshPageList() {
  var DataTable = document.querySelector('#pageListDiv');
  var pageList = DataTable.querySelector('#pageList');
  pageList.parentNode.removeChild(pageList);
  pageList = document.createElement('div');
  pageList.id = "pageList";
  pageList.className = "list-group list-group-horizontal text-center justify-content-center";
  DataTable.appendChild(pageList);

  var pageN = 1;
  if (params.length != 0) {
    pageN = Number(params[0]);
  }

  var SHOW_PAGE_NUM = 9; // 하단 페이지 링크 보여주는 갯수
  var startIdx = 0 + SHOW_NUM * (pageN - 1);
  var endIdx = (SHOW_NUM * pageN);
  var count = Number(cnt);

  var a = document.createElement('a');
  var hrefStr = "index_ADMIN.html?page=" + String(((pageN - 1) <= 0) ? 1 : (pageN - 1));
  a.href = hrefStr;
  a.className = "list-group-item list-group-item-primary pageListItem"
  a.innerHTML = "&laquo;"
  pageList.appendChild(a);

  var frontPageN = 0; // 현제 페이지 기준 앞에 나와야할 페이지들 갯수 3page일 경우 1 2 3 등장 frontPageN = 3
  var backPageUnderFive = parseInt((count - endIdx + SHOW_NUM) / SHOW_NUM) + 1;
  if (pageN < 6) frontPageN = parseInt(pageN % 6);
  else if (backPageUnderFive >= 5) frontPageN = 5; // 현제 페이지가 6이상일 경우 5개로 고정
  else frontPageN = SHOW_PAGE_NUM - backPageUnderFive; // 현제 페이지 이후 페이지가 5 이하일 경우 부족한 많큼 앞에 페이지링크 갯수를 증가

  // front
  for (var i = 0; i < frontPageN - 1; i++) {
    var tmpPageNum = pageN - frontPageN + i + 1;
    var hrefStr = "index_ADMIN.html?page=" + String(tmpPageNum);
    var a = document.createElement('a');
    a.href = hrefStr;
    a.className = "list-group-item list-group-item-primary pageListItem";
    a.innerHTML = String(tmpPageNum);
    pageList.appendChild(a);
  }

  var hrefStr = "index_ADMIN.html?page=" + String(pageN);
  var a = document.createElement('a');
  a.href = hrefStr;
  a.className = "list-group-item list-group-item-primary pageListItem active"
  a.innerHTML = String(pageN);
  pageList.appendChild(a);

  //back
  var backPageN = SHOW_PAGE_NUM - frontPageN; // 현제 페이지 기준 뒤에 나와야할 페이지들 갯수 3page일 경우 10 - 3 = 7 개
  var tmp = (count - endIdx + SHOW_NUM);
  for (var i = 0; i < backPageN; i++) {
    if (parseInt(tmp / SHOW_NUM) > 0) {
      var tmpPageNum = pageN + i + 1;
      var hrefStr = "index_ADMIN.html?page=" + String(tmpPageNum);
      var a = document.createElement('a');
      a.href = hrefStr;
      a.className = "list-group-item list-group-item-primary pageListItem"
      a.innerHTML = String(tmpPageNum);
      pageList.appendChild(a);
    }
    tmp -= SHOW_NUM;
  }

  var a = document.createElement('a');
  var hrefStr = "index_ADMIN.html?page=" + String((pageN * SHOW_NUM > count) ? pageN : (pageN + 1));
  a.href = hrefStr;
  a.className = "list-group-item list-group-item-primary pageListItem"
  a.innerHTML = "&raquo;";
  pageList.appendChild(a);
}

var appendProduct = function (data) {

  var DataTable = document.getElementById('DataTable');
  var tbody = document.createElement('tbody');
  var tr = document.createElement('tr');

  var td = document.createElement('td');
  td.id = 'Code';
  var a = document.createElement('a');
  a.href = 'ProductInfo.html?' + 'Code=' + data.Product_Code;
  a.innerHTML = data.Product_Code;
  td.appendChild(a);
  tr.appendChild(td);

  var td = document.createElement('td');
  td.id = 'Order_No';
  td.innerHTML = data.Order_No;
  tr.appendChild(td);

  var td = document.createElement('td');
  td.id = 'SaleDate';
  td.innerHTML = DateParse(data.SaleDate);
  tr.appendChild(td);

  var td = document.createElement('td');
  td.id = 'Sale_Price';
  td.innerHTML = comma(data.Sale_Price) + '원';
  tr.appendChild(td);

  var td = document.createElement('td');
  td.id = 'isCash';
  var isCash = data.isCash;
  if (isCash == '0') {
    td.innerHTML = '계좌 이체';
  }
  else if (isCash == '1') {
    td.innerHTML = '현금 결제';
  }
  else {
    td.innerHTML = '오류';
  }
  tr.appendChild(td);

  var td = document.createElement('td');
  td.id = 'Customer_ID';
  td.innerHTML = data.Customer_ID;
  tr.appendChild(td);

  tbody.appendChild(tr);
  DataTable.appendChild(tbody);

}

// DataTable 'Product' Load Event
function getSelledProduct(){
  getSelledCnt();

  var param = new Object();
  param.pageNum = 1;
  if (params.length > 0) {
      param.pageNum = Number(params[0]);
  }
  param.showNum = SHOW_NUM;

  $.ajax({
    type: "POST",
    url: '/getProducts/Selled',
    data: param,
    success: function (data) {
      var DataTable = document.getElementById('DataTable');
      DataTable.getElementsByTagName('tbody').item(0).remove();
      for (var i = 0; i < data.length; i++) {
        appendProduct(data[i]);
      }
    },
    error: function (e) {
      alert(e.responseText);
    }
  });

  refreshPageList();

}

getSelledProduct();

// 입금 확인 대기 건수 Load
$.ajax({
  type: "POST",
  url: '/getOrders/OrderCnt',
  success: function (data) {
    console.log(data);
    var OrderCount = document.getElementById('OrderCount');
    OrderCount.innerHTML += data[0].cnt + ' 건';
  },
  error: function (e) {
    alert(e.responseText);
  }
});

// 금일 매출 Load
var Today = new Date();
var Start = Today.getFullYear().toString() + leadingZeros((Today.getMonth() + 1).toString(),2) + Today.getDate().toString() + '000000';
var End = Today.getFullYear().toString() + leadingZeros((Today.getMonth() + 1).toString(),2) + Today.getDate().toString() + '235959';
var DATA = { 'Start': Start, 'End': End };

$.ajax({
  type: "POST",
  url: '/getOrders/TodaySales',
  data: DATA,
  async: false,
  success: function (data) {
    console.log(data);
    var TodaySales = document.getElementById('TodaySales');
    TodaySales.innerHTML += Number(data.Sum).toLocaleString() + ' 원';
  },
  error: function (e) {
    alert(e.responseText);
  }
});

// AllSales
$.ajax({
  type: "POST",
  url: '/getOrders/AllSales',
  async: false,
  success: function (data) {
    console.log(data);
    var TodaySales = document.getElementById('AllSales');
    TodaySales.innerHTML += Number(data.Sum).toLocaleString() + ' 원';
  },
  error: function (e) {
    alert(e.responseText);
  }
});

// // Review Count
// $.ajax({
//   type: "POST",
//   url: '/getBoard/Review/getReviewCount',
//   data: DATA,
//   async: false,
//   success: function (data) {
//     var TodayReviewCount = document.getElementById('TodayReviewCount');
//     TodayReviewCount.innerHTML += data[0].cnt + ' 개';
//   },
//   error: function (e) {
//     alert(e.responseText);
//   }
// });

/* Interface 메소드 */
function DateParse(str) {
  var y = str.substr(0, 4);
  var m = str.substr(4, 2);
  var d = str.substr(6, 2);
  var h = str.substr(8, 2);
  var mi = str.substr(10, 2);
  var s = str.substr(12, 2);

  return (y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s);
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function comma(num) {
  var len, point, str;

  num = num + "";
  point = num.length % 3;
  len = num.length;

  str = num.substring(0, point);
  while (point < len) {
      if (str != "") str += ",";
      str += num.substring(point, point + 3);
      point += 3;
  }

  return str;
}