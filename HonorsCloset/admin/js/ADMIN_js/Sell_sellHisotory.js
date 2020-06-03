$(function () {
    //모든 datepicker에 대한 공통 옵션 설정
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd', //Input Display Format 변경
        showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        showMonthAfterYear: true, //년도 먼저 나오고, 뒤에 월 표시
        changeYear: true, //콤보박스에서 년 선택 가능
        changeMonth: true, //콤보박스에서 월 선택 가능                
        showOn: "both", //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
        buttonImage: "vendor/ADMIN_vendor/jquery-ui-1.12.1.custom/images/calendar.gif", //버튼 이미지 경로
        buttonImageOnly: true, //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
        buttonText: "선택", //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
        yearSuffix: "년", //달력의 년도 부분 뒤에 붙는 텍스트
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], //달력의 월 부분 텍스트
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], //달력의 월 부분 Tooltip 텍스트
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], //달력의 요일 부분 텍스트
        dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], //달력의 요일 부분 Tooltip 텍스트           
        maxDate: '+1',
        yearRange: '-100:+0'
    });

    //input을 datepicker로 선언
    $("#datepicker1").datepicker();
    $("#datepicker2").datepicker();

    //From의 초기값을 오늘 날짜로 설정
    $('#datepicker1').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
    //To의 초기값을 내일로 설정
    $('#datepicker2').datepicker('setDate', '+1D'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
});


var hourSelect1 = document.createElement('select');
hourSelect1.name = 'hourSelect1';
hourSelect1.id = "hourSelect1";
hourSelect1.style = "width : 35%;";
for (var i = 0; i < 24; i++) {
    var option = document.createElement('option');
    var hour = '';
    if (0 <= i && i < 10)
        hour = '0' + String(i);
    else
        hour = String(i);
    option.value = hour;
    option.innerHTML = hour;
    hourSelect1.appendChild(option);
}
var minuteSelect1 = document.createElement('select');
minuteSelect1.name = 'minuteSelect1'
minuteSelect1.id = "minuteSelect1";
minuteSelect1.style = "width : 35%;";
for (var i = 0; i < 60; i++) {
    var option = document.createElement('option');
    var minute = '';
    if (0 <= i && i < 10)
        minute = '0' + String(i);
    else
        minute = String(i);
    option.value = minute;
    option.innerHTML = minute;
    minuteSelect1.appendChild(option);
}
var hourText1 = document.createElement('span');
hourText1.innerHTML = '시';
hourText1.style = "width : 15%; text-align: center;";
var minuteText1 = document.createElement('span');
minuteText1.innerHTML = '분';
minuteText1.style = "width : 15%; text-align: center;";

document.querySelector('#fromTime').appendChild(hourSelect1);
document.querySelector('#fromTime').appendChild(hourText1);
document.querySelector('#fromTime').appendChild(minuteSelect1);
document.querySelector('#fromTime').appendChild(minuteText1);

var hourSelect2 = document.createElement('select');
hourSelect2.name = 'hourSelect2';
hourSelect2.id = "hourSelect2";
hourSelect2.style = "width : 35%;";
for (var i = 0; i < 24; i++) {
    var option = document.createElement('option');
    var hour = '';
    if (0 <= i && i < 10)
        hour = '0' + String(i);
    else
        hour = String(i);
    option.value = hour;
    option.innerHTML = hour;
    hourSelect2.appendChild(option);
}
var minuteSelect2 = document.createElement('select');
minuteSelect2.name = 'minuteSelect2'
minuteSelect2.id = "minuteSelect2";
minuteSelect2.style = "width : 35%;";

for (var i = 0; i < 60; i++) {
    var option = document.createElement('option');
    var minute = '';
    if (0 <= i && i < 10)
        minute = '0' + String(i);
    else
        minute = String(i);
    option.value = minute;
    option.innerHTML = minute;
    minuteSelect2.appendChild(option);
}
var hourText2 = document.createElement('span');
hourText2.innerHTML = '시';
hourText2.style = "width : 15%; text-align: center;";
var minuteText2 = document.createElement('span');
minuteText2.innerHTML = '분';
minuteText2.style = "width : 15%; text-align: center;";

document.querySelector('#toTime').appendChild(hourSelect2);
document.querySelector('#toTime').appendChild(hourText2);
document.querySelector('#toTime').appendChild(minuteSelect2);
document.querySelector('#toTime').appendChild(minuteText2);



var salesHistory = [];
var currIdx = -1;

var salesHistoryDetaileEventFunc = function (idx) {
    var index = idx;
    return function () {
        currIdx = index;
        var saleProductTable = document.querySelector('#orderDetaileTable');
        var tbody = saleProductTable.querySelector('tbody');
        tbody.parentNode.removeChild(tbody);
        tbody = document.createElement('tbody');
        saleProductTable.appendChild(tbody);

        var tr = document.createElement('tr');
        tr.id = salesHistory[currIdx].No;

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = salesHistory[currIdx].No;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Customer_ID';
        td.innerHTML = salesHistory[currIdx].Customer_ID;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'SaleDate';
        var saleDate = salesHistory[currIdx].SaleDate;
        saleDate = saleDate.substring(0, 4) + '/' + saleDate.substring(4, 6) + '/' + saleDate.substring(6, 8) + ' ' + saleDate.substring(8, 10) + ':' + saleDate.substring(10, 12) + ':' + saleDate.substring(12, 14);
        td.innerHTML = saleDate;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Price';
        td.className = 'text-right';
        var priceStr = String(salesHistory[currIdx].Price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'isCash';
        if (salesHistory[currIdx].isCash == '0')
            td.innerHTML = '계좌이체';
        else
            td.innerHTML = '현금';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'isCanceled';
        if (salesHistory[currIdx].isCanceled == '0')
            td.innerHTML = 'X';
        else
            td.innerHTML = 'O';
        tr.appendChild(td);

        tbody.appendChild(tr);


        var saleProductTable = document.querySelector('#orderedProductsTable');
        var tbody = saleProductTable.querySelector('tbody');
        tbody.parentNode.removeChild(tbody);
        tbody = document.createElement('tbody');
        saleProductTable.appendChild(tbody);
        data = salesHistory[currIdx].orderedProducts;
        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr');
            tr.id = data[i].Code;

            var td = document.createElement('td');
            var a = document.createElement('a');
            a.id = 'Code';
            a.innerHTML = data[i].Code;
            a.addEventListener('mouseover', OverThumbnailEvent);
            a.addEventListener('mouseout', OverThumbnailOutEvent);
            td.appendChild(a);
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'RegistDate';
            var registDate = data[i].RegistDate;
            registDate = registDate.substring(0, 4) + '/' + registDate.substring(4, 6) + '/' + registDate.substring(6, 8);
            td.innerHTML = registDate;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'FirstPrice';
            td.className = 'text-right';
            var priceStr = String(data[i].FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            td.innerHTML = priceStr + '원';
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'LastPrice';
            td.className = 'text-right';
            var priceStr = String(data[i].Sale_Price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            td.innerHTML = priceStr + '원';
            tr.appendChild(td);

            tbody.appendChild(tr);
        }
    };
}

var refreshSalesHistoryTable = function (data) {
    var saleProductTable = document.querySelector('#salesHistoryTable');
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].No;
        tr.addEventListener('click', salesHistoryDetaileEventFunc(i));

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = data[i].No;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Customer_ID';
        td.innerHTML = data[i].Customer_ID;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'SaleDate';
        var saleDate = data[i].SaleDate;
        saleDate = saleDate.substring(0, 4) + '/' + saleDate.substring(4, 6) + '/' + saleDate.substring(6, 8) + ' ' + saleDate.substring(8, 10) + ':' + saleDate.substring(10, 12) + ':' + saleDate.substring(12, 14);
        td.innerHTML = saleDate;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Price';
        td.className = 'text-right';
        var priceStr = String(data[i].Price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'isCash';
        if (data[i].isCash == '0')
            td.innerHTML = '계좌이체';
        else
            td.innerHTML = '현금';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'isCanceled';
        if (data[i].isCanceled == '0')
            td.innerHTML = 'X';
        else
            td.innerHTML = 'O';
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

var getSalesHistoryAll = function () {
    var param = new Object();
    var searchKeyword = document.querySelector('#searchKeyword').value;
    var datepicker1 = document.querySelector('#datepicker1').value.replace(/\-/g, '/');
    var datepicker2 = document.querySelector('#datepicker2').value.replace(/\-/g, '/');
    var hourSelect1 = document.querySelector('#hourSelect1').value;
    var hourSelect2 = document.querySelector('#hourSelect2').value;
    var minuteSelect1 = document.querySelector('#minuteSelect1').value;
    var minuteSelect2 = document.querySelector('#minuteSelect2').value;
    var fromDateStr = datepicker1 + ' ' + hourSelect1 + ':' + minuteSelect1 + ':00';
    var toDateStr = datepicker2 + ' ' + hourSelect2 + ':' + minuteSelect2 + ':59';
    var fromDate = datepicker1.replace(/\//g, '') + hourSelect1 + minuteSelect1 + '00';
    var toDate = datepicker2.replace(/\//g, '') + hourSelect2 + minuteSelect2 + '59';

    if (fromDateStr.match(/\d\d\d\d\/\d\d\/\d\d\s\d\d:\d\d:\d\d/) == null) {
        alert('error : From 날짜를 올바르게 설정해 주세요');
    } else if (toDateStr.match(/\d\d\d\d\/\d\d\/\d\d\s\d\d:\d\d:\d\d/) == null) {
        alert('error : To 날짜를 올바르게 설정해 주세요');
    } else if (fromDate >= toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
    } else {
        param.fromDate = fromDate;
        param.toDate = toDate;
        param.keyword = searchKeyword;
        $.ajax({
            type: "POST",
            url: '/getOrders/salesHistory/all',
            data: param,
            success: function (data) {
                salesHistory = data;
                if (salesHistory.length == 0) {
                    var msg = fromDateStr + ' ~ ' + toDateStr + ' : 조회결과가 없습니다.';
                    if (searchKeyword != '')
                        msg += ' (검색어 : ' + searchKeyword + ')'
                    alert(msg);
                } else {
                    refreshSalesHistoryTable(salesHistory);
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }

}

var cancelSales = function () {
    if (currIdx == -1) {
        alert('판매내역을 선택해 주세요.')
        return;
    }
    if (! confirm('주문번호: '+ salesHistory[currIdx].No + ' - 판매취소 하시겠습니까?')) return;
    
    var param = new Object();
    param.salesHistory = salesHistory[currIdx];
    $.ajax({
        type: "POST",
        url: '/sales/cancelSales',
        data: param,
        success: function (data) {
            window.location.href = window.location.href;
            alert(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
document.querySelector('#getSalesHistoryBtn').addEventListener('click', getSalesHistoryAll);
document.querySelector('#cancelSalesBtn').addEventListener('click', cancelSales);

// DataTable MouseOver시 Thumbnail 노출
function OverThumbnailEvent(event) {
    var target_Code = event.target.innerHTML;

    var Over_Thumbnail = document.createElement('img');
    Over_Thumbnail.id = 'Over_Thumbnail';
    Over_Thumbnail.style.width = '200px';
    Over_Thumbnail.style.height = '200px';
    Over_Thumbnail.src = '../src/product/' + target_Code + '/' + target_Code + '-0.jpg';

    var Over_div = document.getElementById('Over_div');
    Over_div.style.top = event.pageY + 10 + 'px';
    Over_div.style.left = event.pageX + 10 + 'px';
    Over_div.style.display = 'inline-block';

    Over_Thumbnail.onerror = function(){
     Over_Thumbnail.style.display = 'none';
     Over_div.style.display = 'none';
    };

    Over_div.appendChild(Over_Thumbnail);
}

// DataTable MouseOut시 Thumbnail 삭제
function OverThumbnailOutEvent() {
    Over_div = document.getElementById('Over_div');
    Over_Thumbnail = document.getElementById('Over_Thumbnail');

    Over_div.removeChild(Over_Thumbnail);
    Over_div.style.display = 'none';
}
