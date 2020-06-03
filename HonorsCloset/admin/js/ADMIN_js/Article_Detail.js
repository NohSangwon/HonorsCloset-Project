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

var getArticle = function () {
    $.ajax({
        type: "POST",
        url: '/Article/getArticle',
        data: {
            no: params[0]
        },
        success: function (data) {
            document.querySelector('#articleTitle').value = data[0].Title;
            document.querySelector('#articleDate').value = data[0].Date;
            document.querySelector('#articleURL').value = data[0].URL;
            document.querySelector('#currArticleThumbnail').src = data[0].Thumbnail;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

getArticle();


var updateArticleSubmitFunc = function () {
    var articleTitle = document.querySelector('#articleTitle');
    var articleDate = document.querySelector('#articleDate');
    var articleURL = document.querySelector('#articleURL');
    var articleThumbnail = document.querySelector('#articleThumbnail');

    if (articleTitle.value == '') {
        alert('기사 제목을 입력해주세요');
        return false;
    }
    if (articleDate.value == '') {
        alert('기사 날짜를 입력해주세요');
        return false;
    }
    if (articleURL.value == '') {
        alert('기사 URL을 입력해주세요');
        return false;
    }
    var isImgUpdated = 1;
    if (articleThumbnail.value == null || articleThumbnail.value == undefined || articleThumbnail.value == '') {
        isImgUpdated = 0;
    }

    var articleUrl = articleURL.value.replace(/\//g, '~');
    articleUrl = articleUrl.replace(/\?/g, '`');
    
    var url = '/Article/update/' + params[0] + '/' + articleTitle.value + '/' + articleDate.value + '/' + articleUrl + '/' + isImgUpdated;

    $('#updateArticleForm').ajaxForm({
        url: url,
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            if (isImgUpdated == 1) {
                var value = articleThumbnail.value.replace(/\\/g, '/');
                var indexOfPoint = value.indexOf('.');
                var subEx = value.substring(indexOfPoint + 1, value.length);
                if (subEx == 'jpg' || subEx == 'jpeg' || subEx == 'png' || subEx == 'JPG' || subEx == 'JPEG' || subEx == 'PNG') {
                    return true;
                } else {
                    alert('.jpg .jpeg .png 파일만 업로드 가능합니다');
                    return false;
                }
            }
        },
        success: function (response, status) {
            if (response == 'err') {
                alert("err");
            } else {
                window.location.href = window.location.href;
                alert("기사 수정 완료!!");
            }
        },
        error: function (err) {
            alert(err.message);
        }
    });
    $("#updateArticleForm").submit();
}
var updateArticleSubmitBtn = document.querySelector('#updateArticleSubmitBtn');
updateArticleSubmitBtn.addEventListener('click', updateArticleSubmitFunc);

var deleteArticleFunc = function () {
    var answer = confirm("데이터를 삭제하시겠습니까?");
    if (answer) {
        $.ajax({
            type: "POST",
            url: '/Article/delete',
            data: {
                no: params[0]
            },
            success: function (data) {
                if (data == 'err') {
                    alert("error 발생");
                    window.location.href = window.location.href;
                } else {
                    window.location.href = 'Article';
                    alert("기사 삭제 완료!!");
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
var deleteArticleBtn = document.querySelector('#deleteArticleBtn');
deleteArticleBtn.addEventListener('click', deleteArticleFunc);
