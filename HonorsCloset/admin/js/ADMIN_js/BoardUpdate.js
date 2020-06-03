var URL = window.location.href.split('?')[1];
var URL_Splited = URL.split('&');
var No = URL_Splited[0].split('=')[1];
var Specification = URL_Splited[1].split('=')[1];
var DATA = {
    "No": No,
    "Specification": Specification
}
var Contents = ""

$.ajax({
    type: "POST",
    url: '/getBoard/loadBoard',
    data: DATA,
    dataType: 'json',
    success: function (data) {
        InsertBoard(data[0]);
    },
    error: function (e) {
        alert(e.responseText);
    }
});

function InsertBoard(data) {
    var Title = document.getElementById('Title');
    var Specification = document.getElementById('Specification');
    var isNotice = document.getElementsByName('isNotice');
    var tinymce = document.getElementById('Tinymce');

    Title.value = data.Title;

    var Data_Specification = data.Specification;
    if(Data_Specification == "0"){
        Specification.value = "0";
    }
    else{
        Specification.value = "1";
    }
    Specification.disabled = true;

    var Data_isNotice = data.Specification;
    if(Data_isNotice == '1'){
        isNotice[0].checked = true;
    }
    else{
        //Do Nothing..
    }

    // Tinymce Load
    tinymce.value = data.Contents;

    if (data.isNotice == "1") {
        isNotice[0].checked = true;
    }
    else {
        // Do Nothing...
    }
}

// 수정 버튼 Event
var OK_Button = document.getElementById('OK_Button');
OK_Button.addEventListener('click',function(){
    var No = URL_Splited[0].split('=')[1];
    var Specification = URL_Splited[1].split('=')[1];
    var Title = document.getElementById('Title');
    var isNotice = document.getElementsByName('isNotice');
    var Today = new Date();

    var isNoticeValue = '';
    if(isNotice[0].checked == true){
        isNoticeValue = '1';
    }
    else{
        isNoticeValue = '0';
    }

    var DateString = Today.format('yyyyMMddHHmm');

    var DATA = {
        'No':No,
        'Specification':Specification,
        'Title':Title.value,
        'isNotice':isNoticeValue,
        'Contents':tinymce.activeEditor.getContent(),
        'Date' : DateString
    }

    console.log(DATA);

    $.ajax({
        type: "POST",
        url: '/updateBoard/Update',
        data: DATA,
        dataType: 'json',
        success: function (data) {
            alert('수정되었습니다.');
            history.back();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
})

// 뒤로 버튼 Event
var BACK_Button = document.getElementById('BACK_Button');
BACK_Button.addEventListener('click',function(){
    history.back();
})

//Interface
Date.prototype.format = function (f) {

    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
    });
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };