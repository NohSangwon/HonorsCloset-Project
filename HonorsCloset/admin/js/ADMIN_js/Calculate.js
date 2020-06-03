var calculateList = null;

var insertCalculateBtn = document.querySelector('#insertCalculateBtn');
insertCalculateBtn.addEventListener('click', function () {
    var calculateOverLay = document.querySelector('.calculateOverLay');
    calculateOverLay.style.display = 'block';
});

var insertCalculateCancelBtn = document.querySelector("#insertCalculateCancelBtn");
insertCalculateCancelBtn.addEventListener('click', function () {
    var calculateOverLay = document.querySelector('.calculateOverLay');
    calculateOverLay.style.display = 'none';
});

var goCalculateDetailFunc = function (idx) {
    var index = idx;
    return function () {
        window.location.href = 'Calculate_Detail?season=' + calculateList[index].Season;
    }
}

var refreshCalculateTable = function () {
    var calculateTable = document.querySelector('#calculateTable');
    var tbody = calculateTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    calculateTable.appendChild(tbody);

    var data = calculateList;
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].Season;
        tr.addEventListener('click', goCalculateDetailFunc(i));
        tbody.appendChild(tr);

        var td = document.createElement('td');
        td.id = 'Sesson';
        var seasonCode = data[i].Season;
        var indexBar = seasonCode.indexOf('-');
        var year = seasonCode.substring(0, indexBar);
        var season = seasonCode.substring(indexBar + 1, indexBar.length);

        var seasonName = year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 정산';

        td.innerHTML = seasonName;
        tr.appendChild(td);
    }
}

var getCalculateList = function () {
    $.ajax({
        type: "POST",
        url: '/Calculate/getCalculateList/DESC',
        async: false,
        success: function (data) {
            calculateList = data;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

getCalculateList();
if (calculateList != null) {
    refreshCalculateTable();
}

var insertCalculateSubmitFunc = function () {
    var yearText = document.querySelector('#yearText').value;
    if (yearText != '') {
        if (yearText.match(/\d\d\d\d/) == null) {
            alert('년도를 올바르게 입력해 주세요');
            return;
        }
    } else {
        alert('년도를 입력해주세요');
        return;
    }

    var seasonText = document.querySelector('#seasonType').value;
    var seasonType = '1';
    if (seasonText == 'Spring')
        seasonType = '1';
    else
        seasonType = '2';

    $.ajax({
        type: "POST",
        url: '/Calculate/insertCalculate',
        data: {
            yearText: yearText,
            seasonType: seasonType,
        },
        success: function (data) {
            if (data == 'success') {
                alert(yearText + ' ' + seasonText + ' 정산목록을 등록했습니다');
                window.location.href = window.location.href;
            } else {
                alert(data);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
document.querySelector('#insertCalculateSubmitBtn').addEventListener('click', insertCalculateSubmitFunc);
