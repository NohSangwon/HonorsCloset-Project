var URL_No = window.location.href.split('?');
var No = URL_No[1].split('=')[1];
var DATA = {
    "No": No
}

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



$.ajax({
    type: "POST",
    url: '/getBoard/Review/getReviewByNoClient',
    data: DATA,
    dataType: 'json',
    success: function (data) {
        appendBoard(data[0]);
    },
    error: function (e) {
        alert(e.responseText);
    }
});

function appendBoard(data) {
    var Title = document.getElementById('Title');
    Title.value = data.Title;
    var Tinymce = document.getElementById('Tinymce');
    Tinymce.innerHTML = data.Contents;
}




var Update_Button = document.getElementById('Update_Button');
Update_Button.addEventListener('click', function () {
    var Title = "";
    Title = document.getElementById('Title').value;
    var Specification = document.getElementById('Specification').value;

    // 예외처리 - 제목 미입력시
    if (Title == "") {
        alert('제목을 입력해주세요.');
        return;
    }

    // 예외처리 - 게시판 분류 미선택시
    if (Specification == "#") {
        alert('게시판 분류를 선택해주세요.');
        return;
    }

    var Contents = tinymce.activeEditor.getContent();
    var Today = new Date();
    var DateString = Today.format('yyyyMMddHHmm');

    var DATA = {
        "No": params[0],
        "Title": Title,
        "Contents": Contents,
        "Date": DateString,
    };

    $.ajax({
        type: "POST",
        url: '/updateBoard/updateReview',
        data: DATA,
        traditional: true,
        async: false,
        success: function (data) {
            alert('수정하였습니다.');
            window.location.href = "review.html";
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    // 페이지 새로고침

})

// Date Format InterFace
Date.prototype.format = function (f) {

    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy":
                return d.getFullYear(); // 년 (4자리)
            case "yy":
                return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM":
                return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd":
                return d.getDate().zf(2); // 일 (2자리)
            case "KS":
                return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL":
                return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES":
                return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL":
                return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH":
                return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh":
                return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm":
                return d.getMinutes().zf(2); // 분 (2자리)
            case "ss":
                return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p":
                return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default:
                return $1;
        }
    });
};

String.prototype.string = function (len) {
    var s = '',
        i = 0;
    while (i++ < len) {
        s += this;
    }
    return s;
};
String.prototype.zf = function (len) {
    return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
    return this.toString().zf(len);
};