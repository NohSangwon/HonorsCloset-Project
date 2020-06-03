var insertArticleBtn = document.querySelector('#insertArticleBtn');
insertArticleBtn.addEventListener('click', function () {
    var insertArticleOverLay = document.querySelector('.insertArticleOverLay');
    insertArticleOverLay.style.display = 'block';
});

var insertArticleCancel = document.querySelector("#insertArticleCancel");
insertArticleCancel.addEventListener('click', function () {
    var insertArticleOverLay = document.querySelector('.insertArticleOverLay');
    insertArticleOverLay.style.display = 'none';
});


var article = null;
$.ajax({
    type: "GET",
    url: '/Article/loadArticle',
    success: function (data) {
        article = data;
        createImages();
    },
    error: function (e) {
        alert(e.responseText);
    }
});

function createImages() {
    var data = article;

    var articleArea = document.querySelector('#articleArea');
    var row = document.createElement('div');
    row.className = 'row';
    articleArea.appendChild(row);

    for (var i = 0; i < data.length; i++) {
        if (i % 6 == 0) {
            row = document.createElement('div');
            row.className = 'row';
            articleArea.appendChild(row);
        }

        var col = document.createElement('div');
        col.className = 'col-lg-2 col-sm-2 article-item';
        row.appendChild(col);

        var a = document.createElement('a');
        a.href = 'Article_Detail?no=' + data[i].No;
        col.appendChild(a);

        var img = document.createElement('img');
        img.src = data[i].Thumbnail;
        img.alt = "등록된 이미지가 없습니다";
        a.appendChild(img);

        var p = document.createElement('p');
        p.innerHTML = data[i].Title;
        a.appendChild(p);


        var p = document.createElement('p');
        p.innerHTML = data[i].Date;
        a.appendChild(p);
    }

}

var insertArticleSubmitFunc = function () {

    var articleTitle = document.querySelector('#articleTitle');
    var articleDate = document.querySelector('#articleDate');
    var articleURL = document.querySelector('#articleURL');

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

    var articleUrl = articleURL.value.replace(/\//g, '~');
    articleUrl = articleUrl.replace(/\?/g, '`');
    
    var url = '/Article/insert/' + articleTitle.value + '/' + articleDate.value + '/' + articleUrl;

    $('#insertArticleForm').ajaxForm({
        url: url,
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var articleThumbnail = document.querySelector('#articleThumbnail');
            if (articleThumbnail.value == null || articleThumbnail.value == undefined || articleThumbnail.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
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
                alert("기사 등록 완료!!");
            }
        },
        error: function (err) {
            alert(err.message);
        }
    });
    $("#insertArticleForm").submit();
}
var insertArticleSubmitBtn = document.querySelector('#insertArticleSubmitBtn');
insertArticleSubmitBtn.addEventListener('click', insertArticleSubmitFunc);
