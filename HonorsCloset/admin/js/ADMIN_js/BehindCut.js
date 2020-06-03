var behindcutList = null;

var insertBehindcutBtn = document.querySelector('#insertBehindcutBtn');
insertBehindcutBtn.addEventListener('click', function () {
    var behindeCutOverLay = document.querySelector('.behindeCutOverLay');
    behindeCutOverLay.style.display = 'block';
});

var insertBehindeCutCancelBtn = document.querySelector("#insertBehindeCutCancelBtn");
insertBehindeCutCancelBtn.addEventListener('click', function () {
    var behindeCutOverLay = document.querySelector('.behindeCutOverLay');
    behindeCutOverLay.style.display = 'none';
});

var goBehindeDetailFunc = function (idx) {
    var index = idx;
    return function () {
        window.location.href = 'BehindCut_Detail?season=' + behindcutList[index].Season;
    }
}

var refreshBehindcutTable = function () {
    var behindcutTable = document.querySelector('#behindcutTable');
    var tbody = behindcutTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    behindcutTable.appendChild(tbody);

    var data = behindcutList;
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].Season;
        tr.addEventListener('click', goBehindeDetailFunc(i));
        tbody.appendChild(tr);

        var td = document.createElement('td');
        td.id = 'Sesson';
        var seasonCode = data[i].Season;
        var indexBar = seasonCode.indexOf('-');
        var year = seasonCode.substring(0, indexBar);
        var season = seasonCode.substring(indexBar + 1, indexBar.length);

        var seasonNameH = document.querySelector('#seasonNameH');
        var seasonName = year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 비하인드컷';

        td.innerHTML = seasonName;
        tr.appendChild(td);
    }
}

var getBehindCutList = function () {
    $.ajax({
        type: "POST",
        url: '/BehindCut/getBehindCutList/DESC',
        async: false,
        success: function (data) {
            behindcutList = data;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

getBehindCutList();
if (behindcutList != null) {
    refreshBehindcutTable();
}

var insertBehindeCutSubmitFunc = function () {
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
    var seasonType = '';
    if (seasonText == 'Spring'){
        seasonType = '1';
    }
    else{
        seasonType = '2';
    }

    $.ajax({
        type: "POST",
        url: '/BehindCut/insertBehindCut',
        data: {
            yearText: yearText,
            seasonType: seasonType,
        },
        success: function (data) {
            if (data == 'success') {
                alert(yearText + ' ' + seasonText + ' 비하인드컷을 등록했습니다');
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
document.querySelector('#insertBehindeCutSubmitBtn').addEventListener('click', insertBehindeCutSubmitFunc);
