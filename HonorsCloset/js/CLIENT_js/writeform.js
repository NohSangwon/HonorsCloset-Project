var OK_Button = document.getElementById('OK_Button');
OK_Button.addEventListener('click', function () {
    var No = "";
    var Title = "";
    Title = document.getElementById('Title').value;
    var Specification = document.getElementById('Specification').value;
    var isNotice = "";
    var input_isNotice = document.getElementsByName('isNotice');

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

    var Data_Specification = {
        "Specification": Specification
    }

    $.ajax({
        type: "POST",
        url: '/insertBoard/getCount',
        data: Data_Specification,
        traditional: true,
        async: false,
        success: function (data) {
            if (data == 'err') {
                alert('로그인 후 이용가능합니다!');
            } else {
                No = data.No;


                var DATA = {
                    "No": No,
                    "Specification": Specification,
                    "Title": Title,
                    "Contents": Contents,
                    "Date": DateString,
                    "isNotice": isNotice
                };

                $.ajax({
                    type: "POST",
                    url: '/insertBoard/insertReview',
                    data: DATA,
                    traditional: true,
                    async: false,
                    success: function (data) {

                        alert('등록되었습니다.');

                    },
                    error: function (e) {
                        alert(e.responseText);
                    }
                });
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });



    // 페이지 새로고침

    window.location.href = "review.html";
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