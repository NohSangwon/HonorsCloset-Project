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
    maxDate: '+0',
    yearRange: '-100:+0'
});

//input을 datepicker로 선언
$("#datepicker1").datepicker();
$("#datepicker2").datepicker();
//From의 초기값을 오늘 날짜로 설정
$('#datepicker1').datepicker('setDate', '-1M'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
//To의 초기값을 내일로 설정
$('#datepicker2').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)


// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

var refreshTotalSingUp = function () {
    $.ajax({
        type: "POST",
        url: '/Statics/TotalSignUp',
        dataType: 'json',
        success: function (response) {
            document.querySelector('#totalSignUp').innerHTML = response.total;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

var refreshSignUpChart = function (data) {
    refreshTotalSingUp();

    var signUpChartArea = canvasArea.querySelector('#signUpChartArea');

    document.querySelector('#totalSignUpOnSearch').innerHTML = data.totalSignUp;
    const max = data.max;
    const labelList = [];
    const dataList = [];

    for (var i = 0; i < data.staticsSignUp.length; i++) {
        labelList.push(data.staticsSignUp[i].RegistDate);
        dataList.push(data.staticsSignUp[i].cnt);
    }

    var digit = String(max).length;
    var tmp = 1;
    for (var i = 0; i < digit - 2; i++) {
        tmp *= 10;
    }
    var graphMax = parseInt(max / tmp) * tmp + tmp; // 그래프 MAX 값

    var signUpChart = new Chart(signUpChartArea, {
        type: 'line',
        data: {
            labels: labelList,
            datasets: [{
                label: "가입자",
                lineTension: 0.6,
                backgroundColor: "rgba(2,117,216,0.2)",
                borderColor: "rgba(2,117,216,1)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(2,117,216,1)",
                pointBorderColor: "rgba(255,255,255,0.8)",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                pointHitRadius: 50,
                pointBorderWidth: 1,
                data: dataList,
    }],
        },
        options: {
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 40
                    }
      }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: graphMax,
                        maxTicksLimit: 40
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, .125)",
                    }
      }],
            },
            legend: {
                display: false
            }
        }
    });
}

var currOnBtnId = "dayBtn";

var searchOnYear = function () {
    var currOnBtn = document.querySelector('#' + currOnBtnId);
    currOnBtn.className = 'btn btn-primary';

    currOnBtnId = 'yearBtn';
    var yearBtn = document.querySelector('#' + currOnBtnId);
    yearBtn.className = 'btn btn-primary focus';

    var canvasArea = document.querySelector('#canvasArea');
    var signUpChartArea = canvasArea.querySelector('#signUpChartArea');
    signUpChartArea.parentNode.removeChild(signUpChartArea);

    signUpChartArea = document.createElement('canvas');
    signUpChartArea.id = 'signUpChartArea';
    signUpChartArea.style = 'max-height: 450px;';
    canvasArea.appendChild(signUpChartArea);

    var datepicker1 = document.querySelector('#datepicker1').value.replace(/\-/g, '/');
    var datepicker2 = document.querySelector('#datepicker2').value.replace(/\-/g, '/');
    var fromDateStr = datepicker1;
    var toDateStr = datepicker2;
    var fromDate = datepicker1.replace(/\//g, '');
    var toDate = datepicker2.replace(/\//g, '');

    if (fromDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : From 날짜를 올바르게 설정해 주세요');
    } else if (toDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : To 날짜를 올바르게 설정해 주세요');
    } else if (fromDate >= toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
    } else {
        var param = new Object();
        param.fromDate = fromDate;
        param.toDate = toDate;

        var data = new Object();
        $.ajax({
            type: "POST",
            url: '/Statics/SignUp/year',
            dataType: 'json',
            async: false,
            data: param,
            success: function (response) {
                data = response;
                refreshSignUpChart(data);
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}

var searchOnMonth = function () {
    var currOnBtn = document.querySelector('#' + currOnBtnId);
    currOnBtn.className = 'btn btn-primary';

    currOnBtnId = 'monthBtn';
    var monthBtnBtn = document.querySelector('#' + currOnBtnId);
    monthBtnBtn.className = 'btn btn-primary focus';
    
    var canvasArea = document.querySelector('#canvasArea');
    var signUpChartArea = canvasArea.querySelector('#signUpChartArea');
    signUpChartArea.parentNode.removeChild(signUpChartArea);

    signUpChartArea = document.createElement('canvas');
    signUpChartArea.id = 'signUpChartArea';
    signUpChartArea.style = 'max-height: 450px;';
    canvasArea.appendChild(signUpChartArea);

    var datepicker1 = document.querySelector('#datepicker1').value.replace(/\-/g, '/');
    var datepicker2 = document.querySelector('#datepicker2').value.replace(/\-/g, '/');
    var fromDateStr = datepicker1;
    var toDateStr = datepicker2;
    var fromDate = datepicker1.replace(/\//g, '');
    var toDate = datepicker2.replace(/\//g, '');

    if (fromDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : From 날짜를 올바르게 설정해 주세요');
    } else if (toDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : To 날짜를 올바르게 설정해 주세요');
    } else if (fromDate >= toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
    } else {
        var param = new Object();
        param.fromDate = fromDate;
        param.toDate = toDate;

        var data = new Object();
        $.ajax({
            type: "POST",
            url: '/Statics/SignUp/month',
            dataType: 'json',
            async: false,
            data: param,
            success: function (response) {
                data = response;
                refreshSignUpChart(data);
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}

var searchOnDay = function () {
    var currOnBtn = document.querySelector('#' + currOnBtnId);
    currOnBtn.className = 'btn btn-primary';

    currOnBtnId = 'dayBtn';
    var dayBtnBtn = document.querySelector('#' + currOnBtnId);
    dayBtnBtn.className = 'btn btn-primary focus';
    
    var canvasArea = document.querySelector('#canvasArea');
    var signUpChartArea = canvasArea.querySelector('#signUpChartArea');
    signUpChartArea.parentNode.removeChild(signUpChartArea);

    signUpChartArea = document.createElement('canvas');
    signUpChartArea.id = 'signUpChartArea';
    signUpChartArea.style = 'max-height: 450px;';
    canvasArea.appendChild(signUpChartArea);

    var datepicker1 = document.querySelector('#datepicker1').value.replace(/\-/g, '/');
    var datepicker2 = document.querySelector('#datepicker2').value.replace(/\-/g, '/');
    var fromDateStr = datepicker1;
    var toDateStr = datepicker2;
    var fromDate = datepicker1.replace(/\//g, '');
    var toDate = datepicker2.replace(/\//g, '');

    if (fromDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : From 날짜를 올바르게 설정해 주세요');
    } else if (toDateStr.match(/\d\d\d\d\/\d\d\/\d\d/) == null) {
        alert('error : To 날짜를 올바르게 설정해 주세요');
    } else if (fromDate >= toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
    } else {
        var param = new Object();
        param.fromDate = fromDate;
        param.toDate = toDate;

        var data = new Object();
        $.ajax({
            type: "POST",
            url: '/Statics/SignUp/day',
            dataType: 'json',
            async: false,
            data: param,
            success: function (response) {
                data = response;
                refreshSignUpChart(data);
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}

document.querySelector('#yearBtn').addEventListener('click', searchOnYear);
document.querySelector('#monthBtn').addEventListener('click', searchOnMonth);
document.querySelector('#dayBtn').addEventListener('click', searchOnDay);

searchOnDay();
