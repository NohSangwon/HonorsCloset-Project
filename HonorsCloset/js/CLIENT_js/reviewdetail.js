var BoardTable = document.getElementById('BoardTable');
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
    var BoardTable = document.getElementById('BoardTable');
    var tbody = BoardTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);

    var Writer = document.getElementById('Writer');
    Writer.innerHTML = data.Writer;

    var Title = document.getElementById('Title');
    Title.innerHTML = data.Title;

    var Specification = document.getElementById('Specification');
    var ConvertedSpecification = data.Specification;
    if (ConvertedSpecification == '0') {
        Specification.innerHTML = '공지사항';
    } else if (ConvertedSpecification == '1') {
        Specification.innerHTML = 'FAQ';
    } else if (ConvertedSpecification == '2') {
        Specification.innerHTML = '리뷰';
    } else {
        Specification.innerHTML = 'Error';
    }

    var RegistDate = document.getElementById('Date');
    RegistDate.innerHTML = DateParse(data.Date);

    var Hit = document.getElementById('Hit');
    Hit.innerHTML = data.Hit;

    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = "Contents";
    td.innerHTML = data.Contents;
    td.setAttribute('colspan', '2');
    tr.appendChild(td);
    tbody.appendChild(tr);

    BoardTable.appendChild(tbody);
}

// Update Button 이벤트
var Update_Button = document.getElementById('Update_Button');
Update_Button.addEventListener('click', function () {
    $.ajax({
            type: "POST",
            url: '/updateBoard/usercheck',
            data: {
                Writer : document.querySelector('#Writer').innerHTML
            },
            success: function (data) {
                if (data == 'err') {
                    alert("수정 권한이 없습니다!");
                } else {
                     window.location.href = "reviewupdate.html?" + "No=" + No;
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
})

var Delete_Button = document.getElementById('Delete_Button');
Delete_Button.addEventListener('click', function () {
    var del;
    del = confirm("정말 삭제하시겠습니까?");
    if (del) {
        $.ajax({
            type: "POST",
            url: '/deleteBoard/deleteReview',
            data: {
                No : params[0],
                Writer : document.querySelector('#Writer').innerHTML
            },
            success: function (data) {
                if (data == '삭제 권한이 없습니다.') {
                    alert("삭제 권한이 없습니다.");
                } else {
                    window.location.href = 'review.html';
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
})

// Back Button 이벤트
var Back_Button = document.getElementById('Back_Button');
Back_Button.addEventListener('click', function () {
    history.back();
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