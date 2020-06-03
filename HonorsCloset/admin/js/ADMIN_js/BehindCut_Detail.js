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

var seasonCode = params[0];
var indexBar = seasonCode.indexOf('-');
var year = seasonCode.substring(0, indexBar);
var season = seasonCode.substring(indexBar + 1, indexBar.length);

var seasonNameH = document.querySelector('#seasonNameH');
var seasonName = year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 비하인드컷';
seasonNameH.innerHTML = seasonName;

var imageList = null;
$.ajax({
    type: "POST",
    url: '/BehindCut/getImageList',
    data: {
        seasonCode: seasonCode
    },
    success: function (data) {
        imageList = data;
        createImages();
    },
    error: function (e) {
        alert(e.responseText);
    }
});

var deleteImg = function (season_, realImg_, thumbnail_) {
    var season = season_;
    var realImg = realImg_;
    var thumbnail = thumbnail_;
    return function () {
        if (confirm('이미지를 삭제하시겠습니까?')) {
            $.ajax({
                type: "POST",
                url: '/BehindCut/deleteImg',
                data: {
                    season: season,
                    realImg: realImg,
                    thumbnail: thumbnail
                },
                success: function (data) {
                    alert('이미지 삭제완료');
                    window.location.href = window.location.href;
                },
                error: function (e) {
                    alert(e.responseText);
                }
            });
        }
    }
}

function createImages() {
    var data = imageList;

    var imageArea = document.querySelector('#imageArea');
    var row = document.createElement('div');
    row.className = 'row';
    imageArea.appendChild(row);


    for (var i = 0; i < data.thumbnail.length; i++) {
        if (i % 3 == 0) {
            var row = document.createElement('div');
            row.className = 'row';
            imageArea.appendChild(row);
        }
        
        var col = document.createElement('div');
        col.className = 'col-lg-4 col-sm-4 img-item';
        row.appendChild(col);

        var table = document.createElement('table');
        col.appendChild(table);

        var colgroup = document.createElement('colgroup');
        var col = document.createElement('col');
        col.width = "45%";
        colgroup.appendChild(col);
        var col = document.createElement('col');
        col.width = "45%";
        colgroup.appendChild(col);
        var col = document.createElement('col');
        col.width = "10%";
        colgroup.appendChild(col);
        table.appendChild(colgroup);

        var tr = document.createElement('tr');
        table.appendChild(tr);

        var td = document.createElement('td');
        var img = document.createElement('img');
        img.id = "thumbnail";
        img.src = '../src/behindcut/' + seasonCode + '/Thumbnail/' + data.thumbnail[i] + '.jpg';
        img.alt = "등록된 이미지가 없습니다";
        td.appendChild(img);
        tr.appendChild(td);

        var td = document.createElement('td');
        var img = document.createElement('img');
        img.id = "realImg";
        img.src = '../src/behindcut/' + seasonCode + '/' + data.realImg[i] + '.jpg';
        img.alt = "등록된 이미지가 없습니다";
        td.appendChild(img);
        tr.appendChild(td);

        var td = document.createElement('td');
        var deleteBtn = document.createElement('button');
        deleteBtn.className = "deleteImgBtn btn btn-primary";
        deleteBtn.id = data.thumbnail[i];
        deleteBtn.innerHTML = "X";
        deleteBtn.addEventListener('click', deleteImg(seasonCode, data.realImg[i], data.thumbnail[i]));
        td.appendChild(deleteBtn);
        tr.appendChild(td);
    }
}

var imgChange = function (input_, img_) {
    var input = input_;
    var img = img_;
    return function () {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target.result;
            }

            reader.readAsDataURL(input.files[0]);
        } else {
            img.src = null;
        }
    };
}

var deleteImgSection = function (row_) {
    var row = row_;
    return function () {
        row.parentNode.removeChild(row);
    };
}

var addInputSection = function () {
    var addImgArea = document.querySelector('#addImgArea');
    // thumbnail
    var row = document.createElement('div');
    row.className = 'row imgSection';
    row.id = 'imgSection';
    addImgArea.appendChild(row);

    var col = document.createElement('div');
    col.className = 'col-lg-5 col-sm-5 mb-3';
    row.appendChild(col);

    var table = document.createElement('table');
    table.className = "text-center";
    col.appendChild(table);

    var colgroup = document.createElement('colgroup');
    var col = document.createElement('col');
    col.width = '50%';
    colgroup.appendChild(col);
    var col = document.createElement('col');
    col.width = '50%';
    colgroup.appendChild(col);
    table.appendChild(colgroup);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    td.colSpan = '2';
    td.innerHTML = 'Thumbnail';
    tr.appendChild(td);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    tr.appendChild(td);

    var input = document.createElement('input');
    input.type = 'file';
    input.className = 'form-control';
    input.id = 'thumbnailInput';
    input.name = 'thumbnailInput';
    input.accept = ".jpg, .jpeg, .png";
    td.appendChild(input);

    var td = document.createElement('td');
    tr.appendChild(td);

    var img = document.createElement('img');
    img.alt = '등록된 사진이 없습니다';
    img.id = 'thumbnailView';
    td.appendChild(img);

    input.addEventListener('change', imgChange(input, img));

    // original
    var col = document.createElement('div');
    col.className = 'col-lg-5 col-sm-5';
    row.appendChild(col);

    var table = document.createElement('table');
    table.className = "text-center";
    col.appendChild(table);

    var colgroup = document.createElement('colgroup');
    var col = document.createElement('col');
    col.width = '50%';
    colgroup.appendChild(col);
    var col = document.createElement('col');
    col.width = '50%';
    colgroup.appendChild(col);
    table.appendChild(colgroup);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    td.colSpan = '2';
    td.innerHTML = 'Original';
    tr.appendChild(td);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    tr.appendChild(td);

    var input = document.createElement('input');
    input.type = 'file';
    input.className = 'form-control';
    input.id = 'realImgInput';
    input.name = 'realImgInput';
    input.accept = ".jpg, .jpeg, .png";
    td.appendChild(input);

    var td = document.createElement('td');
    tr.appendChild(td);

    var img = document.createElement('img');
    img.alt = '등록된 사진이 없습니다';
    img.id = 'realImgView';
    img.style = "width: 150px; height: auto";
    td.appendChild(img);

    input.addEventListener('change', imgChange(input, img));

    var col = document.createElement('div');
    col.className = 'col-lg-2 col-sm-2';
    row.appendChild(col);

    var btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.id = 'deleteImgSectionBtn';
    btn.innerHTML = 'X';
    btn.addEventListener('click', deleteImgSection(row));
    col.appendChild(btn);

    var addInputAreaBtn = document.querySelector('#addInputAreaBtn');
    addInputAreaBtn.parentNode.removeChild(addInputAreaBtn);
    addInputAreaBtn = document.createElement('button');
    addInputAreaBtn.className = "btn-account btn btn-primary";
    addInputAreaBtn.id = "addInputAreaBtn";
    addInputAreaBtn.innerHTML = '입력란 추가';
    addInputAreaBtn.addEventListener('click', addInputSection);

    addImgArea.appendChild(addInputAreaBtn);
};

document.querySelector('#addInputAreaBtn').addEventListener('click', addInputSection);

var insertNewImgFunc = function () {
    var cnt = document.querySelectorAll('#realImgInput').length;
    $('#imgInsertForm').ajaxForm({
        url: "/BehindCut/insertImg/" + seasonCode + "/" + cnt,
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var realImgInputList = document.querySelectorAll('#realImgInput');
            if (realImgInputList.length <= 0) {
                alert('입력된 파일이 없습니다')
                return false;
            }
            for (var i = 0; i < realImgInputList.length; i++) {
                if (realImgInputList[i].value == null || realImgInputList[i].value == undefined || realImgInputList[i].value == '') {
                    alert('입력이 안된 파일이 있습니다');
                    return false;
                } else {
                    var value = realImgInputList[i].value.replace(/\\/g, '/');
                    var indexOfPoint = value.indexOf('.');
                    var subEx = value.substring(indexOfPoint + 1, value.length);
                    if (subEx == 'jpg' || subEx == 'jpeg' || subEx == 'png' || subEx == 'JPG' || subEx == 'JPEG' || subEx == 'PNG') {
                        continue;
                    } else {
                        alert('.jpg .jpeg .png 파일만 업로드 가능합니다');
                        return false;
                    }
                }
            }

            var thumbnailInputList = document.querySelectorAll('#thumbnailInput');
            for (var i = 0; i < realImgInputList.length; i++) {
                if (thumbnailInputList[i].value == null || thumbnailInputList[i].value == undefined || thumbnailInputList[i].value == '') {
                    alert('입력이 안된 파일이 있습니다');
                    return false;
                } else {
                    var value = thumbnailInputList[i].value.replace(/\\/g, '/');
                    var indexOfPoint = value.indexOf('.');
                    var subEx = value.substring(indexOfPoint + 1, value.length);
                    if (subEx == 'jpg' || subEx == 'jpeg' || subEx == 'png' || subEx == 'JPG' || subEx == 'JPEG' || subEx == 'PNG') {
                        continue;
                    } else {
                        alert('.jpg .jpeg .png 파일만 업로드 가능합니다');
                        return false;
                    }
                }
            }

            return true;
        },
        success: function (response, status) {
            if (response == 'err') {
                alert("err");
            } else {
                window.location.href = window.location.href;
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err.responsetext);
        }
    });
    $("#imgInsertForm").submit();
};

document.querySelector('#insertNewImgBtn').addEventListener('click', insertNewImgFunc);

var deleteBehindcutFunc = function (season_) {
    if (confirm(year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 비하인드컷을 삭제하시겠습니까?')) {
        $.ajax({
            type: "POST",
            url: '/BehindCut/deleteBehindCut',
            data: {
                seasonCode: seasonCode,
            },
            success: function (data) {
                alert(year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 비하인드컷 삭제하였습니다');
                window.location.href = 'BehindCut';
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
document.querySelector('#deleteBehindcutBtn').addEventListener('click', deleteBehindcutFunc);

var deleteVideoFunc = function (season_) {
    if (confirm('동영상을 삭제하시겠습니까?')) {
        $.ajax({
            type: "POST",
            url: '/BehindCut/deleteVideo',
            data: {
                seasonCode: seasonCode,
            },
            success: function (data) {
                alert('동영상을 삭제하였습니다');
                window.location.href = window.location.href;
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
document.querySelector('#deleteVideoBtn').addEventListener('click', deleteVideoFunc);

var loadVideoArea = function () {
    var videoArea = document.querySelector('#videoArea');

    var src = '';
    $.ajax({
        type: "POST",
        url: '/BehindCut/getVideo',
        data: {
            seasonCode: seasonCode,
        },
        async: false,
        success: function (data) {
            src = data[0].Video;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    var videoSource = document.querySelector('#videoSource');
    videoSource.parentNode.removeChild(videoSource);
    videoSource = document.createElement('source');
    videoSource.src = src;
    videoSource.type = "video/mp4";
    videoSource.id = 'videoSource';
    videoArea.appendChild(videoSource);
}
loadVideoArea();

var updateVideoFunc = function (season_) {
    if (confirm('동영상을 업로드하시겠습니까?')) {
        $('#videoInsertForm').ajaxForm({
            url: "/BehindCut/updateVideo/" + seasonCode,
            enctype: "multipart/form-data",
            beforeSubmit: function (data, form, option) {
                var videoFile = document.querySelector('#videoFile');
                if (videoFile.value == null || videoFile.value == undefined || videoFile.value == '') {
                    alert('입력된 파일이 없습니다');
                    return false;
                } else {
                    var value = videoFile.value.replace(/\\/g, '/');
                    var indexOfPoint = value.indexOf('.');
                    var subEx = value.substring(indexOfPoint + 1, value.length);
                    if (subEx == 'mp4' || subEx == 'mkv' || subEx == 'MP4' || subEx == 'MKV') {
                        return true;
                    } else {
                        alert('.mp4 .mkv 파일만 업로드 가능합니다');
                        return false;
                    }
                }
                return true;
            },
            success: function (response, status) {
                if (response == 'err') {
                    alert("err");
                } else {
                    window.location.href = window.location.href;
                    alert("업로드 성공!!");
                }
            },
            error: function (err) {
                alert(err);
            }
        });
        $("#videoInsertForm").submit();
    }
}
document.querySelector('#updateVideoBtn').addEventListener('click', updateVideoFunc);
