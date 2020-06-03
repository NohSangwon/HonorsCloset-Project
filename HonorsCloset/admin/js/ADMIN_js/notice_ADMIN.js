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

var refreshNoticeNoticeTable = function (data) {
    var saleProductTable = document.querySelector('#NoticeNoticeTable');
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);

    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].No;

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = "공지";
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Title';
        var a = document.createElement('a');
        a.href = 'noticeDetail_ADMIN.html?' + "No=" + data[i].No;
        a.innerHTML = data[i].Title;
        td.appendChild(a);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Writer';
        td.innerHTML = '관리자';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Date';
        td.innerHTML = DateParse(data[i].Date);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Hit';
        td.innerHTML = data[i].Hit;
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}
var refreshNoticeTable = function (data) {
    var saleProductTable = document.querySelector('#NoticeTable');
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);
    var pageN = 1;
    if (params.length != 0) {
        pageN = Number(params[0]);
    }

    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].No;

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = cnt - i - (pageN - 1) * SHOW_NUM;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Title';
        var a = document.createElement('a');
        a.href = 'noticeDetail_ADMIN.html?' + "No=" + data[i].No;
        a.innerHTML = data[i].Title;
        td.appendChild(a);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Writer';
        td.innerHTML = '관리자';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Date';
        td.innerHTML = DateParse(data[i].Date);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Hit';
        td.innerHTML = data[i].Hit;
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

var refreshPageList = function () {
    var saleProductTable = document.querySelector('#pageListDiv');
    var pageList = saleProductTable.querySelector('#pageList');
    pageList.parentNode.removeChild(pageList);
    pageList = document.createElement('div');
    pageList.id = "pageList";
    pageList.className = "list-group list-group-horizontal text-center justify-content-center";
    saleProductTable.appendChild(pageList);

    var pageN = 1;
    if (params.length != 0) {
        pageN = Number(params[0]);
    }

    var SHOW_PAGE_NUM = 9; // 하단 페이지 링크 보여주는 갯수
    var startIdx = 0 + SHOW_NUM * (pageN - 1);
    var endIdx = (SHOW_NUM * pageN);
    var count = Number(cnt);

    var a = document.createElement('a');
    var hrefStr = "notice_ADMIN.html?page=" + String(((pageN - 1) <= 0) ? 1 : (pageN - 1));
    if (params.length > 1)
        hrefStr += "&option=" + params[1] + "&keyword=" + params[2];
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
        var hrefStr = "notice_ADMIN.html?page=" + String(tmpPageNum);
        if (params.length > 1)
            hrefStr += "&option=" + params[1] + "&keyword=" + params[2];
        var a = document.createElement('a');
        a.href = hrefStr;
        a.className = "list-group-item list-group-item-primary pageListItem";
        a.innerHTML = String(tmpPageNum);
        pageList.appendChild(a);
    }

    var hrefStr = "notice_ADMIN.html?page=" + String(pageN);
    if (params.length > 1)
        hrefStr += "&option=" + params[1] + "&keyword=" + params[2];
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
            var hrefStr = "notice_ADMIN.html?page=" + String(tmpPageNum);
            if (params.length > 1)
                hrefStr += "&option=" + params[1] + "&keyword=" + params[2];
            var a = document.createElement('a');
            a.href = hrefStr;
            a.className = "list-group-item list-group-item-primary pageListItem"
            a.innerHTML = String(tmpPageNum);
            pageList.appendChild(a);
        }
        tmp -= SHOW_NUM;
    }

    var a = document.createElement('a');
    var hrefStr = "notice_ADMIN.html?page=" + String((pageN * SHOW_NUM > count) ? pageN : (pageN + 1));
    if (params.length > 1)
        hrefStr += "&option=" + params[1] + "&keyword=" + params[2];
    a.href = hrefStr;
    a.className = "list-group-item list-group-item-primary pageListItem"
    a.innerHTML = "&raquo;";
    pageList.appendChild(a);
}

var getNoticeNotice = function () {
    $.ajax({
        type: "POST",
        url: '/getBoard/Notice/notice',
        success: function (data) {
            refreshNoticeNoticeTable(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

var getNoticeCnt = function () {
    var param = new Object();
    param.option = '';
    param.keyword = '';
    if (params.length > 1) {
        param.option = params[1];
        param.keyword = params[2];
    }
    $.ajax({
        type: "POST",
        url: '/getBoard/Notice/cnt',
        async: false,
        data: param,
        success: function (data) {
            cnt = data[0].cnt;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

var getNotice = function () {
    getNoticeCnt();

    var param = new Object();
    param.pageNum = 1;
    if (params.length > 0) {
        param.pageNum = Number(params[0]);
    }
    param.showNum = SHOW_NUM;
    param.option = '';
    param.keyword = '';
    if (params.length > 1) {
        param.option = params[1];
        param.keyword = params[2];
    }
    $.ajax({
        type: "POST",
        url: '/getBoard/Notice',
        data: param,
        success: function (data) {
            refreshNoticeTable(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    refreshPageList();
}

var searchFunc = function () {
    var searchOptionValue = document.querySelector("#searchOption").value;
    var searchKeyword = document.querySelector("#searchKeyword").value;
    var hrefStr = 'notice_ADMIN.html?page=1';
    if (searchKeyword != '')
        hrefStr += '&option=' + searchOptionValue + '&keyword=' + searchKeyword;
    window.location.href = hrefStr;
}
searchBtn.addEventListener('click', searchFunc);
document.querySelector("#searchKeyword").addEventListener('keypress', function(event) {
    var key = event.which || event.keyCode;
    if (key === 13) {
        searchFunc();
    }
});

var refreshSearchOption = function () {
    var options = document.querySelector('#searchOption');
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == params[1])
            options[i].selected = true;
        else
            options[i].selected = false;
    }
}
var refreshSearchKeyword = function () {
    var searchKeyword = document.querySelector('#searchKeyword');
    searchKeyword.value = params[2];
}

if (params.length > 1) {
    refreshSearchOption();
    refreshSearchKeyword();
}
getNoticeNotice();
getNotice();

var WriteForm = document.getElementById('WriteForm');
WriteForm.addEventListener('click',function(){
    window.location.href = './WriteForm.html';
})

//============ InterFace ===============
function DateParse(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);
    var h = str.substr(8, 2);
    var mi = str.substr(10, 2);
    
    return (y + '-' + m + '-' + d + ' ' + h + ':' + mi)
}