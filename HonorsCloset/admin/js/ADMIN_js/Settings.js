var updateLogoBtn = document.querySelector('#updateLogoBtn');
updateLogoBtn.addEventListener('click', function () {
    var logoOverLay = document.querySelector('.logoOverLay');
    logoOverLay.style.display = 'block';
});

var updateLogoCancel = document.querySelector("#updateLogoCancel");
updateLogoCancel.addEventListener('click', function () {
    var logoOverLay = document.querySelector('.logoOverLay');
    logoOverLay.style.display = 'none';
});
// 메인컷 1
var updateMainCutBtn = document.querySelector('#updateMainCutBtn');
updateMainCutBtn.addEventListener('click', function () {
    var mainCutOverLay = document.querySelector('.mainCutOverLay');
    mainCutOverLay.style.display = 'block';
});

var updateMainCutCancel = document.querySelector("#updateMainCutCancel");
updateMainCutCancel.addEventListener('click', function () {
    var mainCutOverLay = document.querySelector('.mainCutOverLay');
    mainCutOverLay.style.display = 'none';
});

// 메인컷 2
var updateMainCut2Btn = document.querySelector('#updateMainCut2Btn');
updateMainCut2Btn.addEventListener('click', function () {
    var mainCut2OverLay = document.querySelector('.mainCut2OverLay');
    mainCut2OverLay.style.display = 'block';
});

var updateMainCut2Cancel = document.querySelector("#updateMainCut2Cancel");
updateMainCut2Cancel.addEventListener('click', function () {
    var mainCut2OverLay = document.querySelector('.mainCut2OverLay');
    mainCut2OverLay.style.display = 'none';
});

// 모바일 메인컷 1
var updateMobileMainCutBtn = document.querySelector('#updateMobileMainCutBtn');
updateMobileMainCutBtn.addEventListener('click', function () {
    var mobileMainCutOverLay = document.querySelector('.mobileMainCutOverLay');
    mobileMainCutOverLay.style.display = 'block';
});

var updateMobileMainCutCancel = document.querySelector("#updateMobileMainCutCancel");
updateMobileMainCutCancel.addEventListener('click', function () {
    var mobileMainCutOverLay = document.querySelector('.mobileMainCutOverLay');
    mobileMainCutOverLay.style.display = 'none';
});

// 모바일 메인컷 2
var updateMobileMainCut2Btn = document.querySelector('#updateMobileMainCut2Btn');
updateMobileMainCut2Btn.addEventListener('click', function () {
    var mobileMainCut2OverLay = document.querySelector('.mobileMainCut2OverLay');
    mobileMainCut2OverLay.style.display = 'block';
});

var updateMobileMainCut2Cancel = document.querySelector("#updateMobileMainCut2Cancel");
updateMobileMainCut2Cancel.addEventListener('click', function () {
    var mobileMainCut2OverLay = document.querySelector('.mobileMainCut2OverLay');
    mobileMainCut2OverLay.style.display = 'none';
});

var insertFontBtn = document.querySelector('#insertFontBtn');
insertFontBtn.addEventListener('click', function () {
    var fontOverLay = document.querySelector('.fontOverLay');
    fontOverLay.style.display = 'block';
});

var insertFontCancel = document.querySelector("#insertFontCancel");
insertFontCancel.addEventListener('click', function () {
    var fontOverLay = document.querySelector('.fontOverLay');
    fontOverLay.style.display = 'none';
});

function readURL(input, targetId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + targetId).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        $('#' + targetId).attr('src', null);
    }
}

$("#logoImg").change(function () {
    readURL(this, "logoImgView");
});
$("#mainCutImg").change(function () {
    readURL(this, "mainCutImgView");
});
$("#mainCut2Img").change(function () {
    readURL(this, "mainCut2ImgView");
});
$("#mobileMainCutImg").change(function () {
    readURL(this, "mobileMainCutImgView");
});
$("#mobileMainCut2Img").change(function () {
    readURL(this, "mobileMainCut2ImgView");
});

var updateLogoSubmitFunc = function () {
    $('#logoInsertForm').ajaxForm({
        url: "/Setting/updateLogo",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var logoImg = document.querySelector('#logoImg');
            if (logoImg.value == null || logoImg.value == undefined || logoImg.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var value = logoImg.value.replace(/\\/g, '/');
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
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    $("#logoInsertForm").submit();
}
var updateLogoSubmitBtn = document.querySelector('#updateLogoSubmitBtn');
updateLogoSubmitBtn.addEventListener('click', updateLogoSubmitFunc);

var updateMainCutSubmitFunc = function () {
    $('#maincutInsertForm').ajaxForm({
        url: "/Setting/updateMainCut/1",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var mainCutImg = document.querySelector('#mainCutImg');
            if (mainCutImg.value == null || mainCutImg.value == undefined || mainCutImg.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var value = mainCutImg.value.replace(/\\/g, '/');
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
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    $("#maincutInsertForm").submit();
}
var updateMainCutSubmitBtn = document.querySelector('#updateMainCutSubmitBtn');
updateMainCutSubmitBtn.addEventListener('click', updateMainCutSubmitFunc);

var updateMainCut2SubmitFunc = function () {
    $('#maincut2InsertForm').ajaxForm({
        url: "/Setting/updateMainCut/2",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var mainCut2Img = document.querySelector('#mainCut2Img');
            if (mainCut2Img.value == null || mainCut2Img.value == undefined || mainCut2Img.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var value = mainCut2Img.value.replace(/\\/g, '/');
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
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    $("#maincut2InsertForm").submit();
}
var updateMainCut2SubmitBtn = document.querySelector('#updateMainCut2SubmitBtn');
updateMainCut2SubmitBtn.addEventListener('click', updateMainCut2SubmitFunc);

var updateMobileMainCutSubmitFunc = function () {
    $('#mobileMainCutInsertForm').ajaxForm({
        url: "/Setting/updateMobileMainCut/1",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var mobileMainCutImg = document.querySelector('#mobileMainCutImg');
            if (mobileMainCutImg.value == null || mobileMainCutImg.value == undefined || mobileMainCutImg.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var value = mobileMainCutImg.value.replace(/\\/g, '/');
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
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    $("#mobileMainCutInsertForm").submit();
}
var updateMobileMainCutSubmitBtn = document.querySelector('#updateMobileMainCutSubmitBtn');
updateMobileMainCutSubmitBtn.addEventListener('click', updateMobileMainCutSubmitFunc);

var updateMobileMainCut2SubmitFunc = function () {
    $('#mobileMainCut2InsertForm').ajaxForm({
        url: "/Setting/updateMobileMainCut/2",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var mobileMainCut2Img = document.querySelector('#mobileMainCut2Img');
            if (mobileMainCut2Img.value == null || mobileMainCut2Img.value == undefined || mobileMainCut2Img.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var value = mobileMainCut2Img.value.replace(/\\/g, '/');
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
                alert("업로드 성공!!");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    $("#mobileMainCut2InsertForm").submit();
}
var updateMobileMainCut2SubmitBtn = document.querySelector('#updateMobileMainCut2SubmitBtn');
updateMobileMainCut2SubmitBtn.addEventListener('click', updateMobileMainCut2SubmitFunc);

var fontList = null;
var getFontList = function () {
    $.ajax({
        type: "POST",
        url: '/Setting/getFontFileList',
        success: function (data) {
            var selectFont = document.querySelector('#selectFont');
            while (selectFont.hasChildNodes()) {
                selectFont.removeChild(selectFont.firstChild);
            }
            document.querySelector('#currFontTitle').innerHTML = data.currFont.title;
            document.querySelector('#selectedFontTitle').innerHTML = data.currFont.title;

            fontList = data.fontList;
            for (var i = 0; i < fontList.length; i++) {
                var option = document.createElement('option');
                if (fontList[i].title == data.currFont.title)
                    option.selected = true;
                option.value = i;
                option.innerHTML = fontList[i].fileName;
                selectFont.appendChild(option);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

var selectFont = document.querySelector('#selectFont');
selectFont.addEventListener("change", function () {
    document.querySelector('#selectedFontTitle').innerHTML = fontList[Number(selectFont.value)].title;

    var selectedFontExample = document.querySelector('#selectedFontExample');
    selectedFontExample.setAttribute("style", 'font-family: ' + fontList[Number(selectFont.value)].fileName + ', sans-serif !important;');
});

var insertFontSubmitFunc = function () {
    $('#fontInsertForm').ajaxForm({
        url: "/Setting/insertFont",
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            var fontFile = document.querySelector('#fontFile');
            if (fontFile.value == null || fontFile.value == undefined || fontFile.value == '') {
                alert('입력된 파일이 없습니다');
                return false;
            } else {
                var isExist = 0;

                var value = fontFile.value.replace(/\\/g, '/');
                var indexOfPoint = value.indexOf('.');
                var subEx = value.substring(indexOfPoint + 1, value.length);
                if (subEx != 'ttf') {
                    alert('.ttf 파일만 업로드 가능합니다');
                    return false;
                }

                value = value.match(/\/([^\/]+).ttf/)[1]
                for (var i = 0; i < fontList.length; i++) {
                    if (value == fontList[i].fileName) {
                        isExist = 1;
                        break;
                    }
                }
                if (isExist) {
                    alert('이미 저장된 파일명입니다');
                    return false;
                } else {
                    return true;
                }
            }
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
    $('#fontInsertForm').submit();
}
var insertFontSubmitBtn = document.querySelector('#insertFontSubmitBtn');
insertFontSubmitBtn.addEventListener('click', insertFontSubmitFunc);


var updateFontSubmitFunc = function () {
    var selectFont = document.querySelector('#selectFont');
    var param = new Object();
    param.fontFile = fontList[Number(selectFont.value)];
    $.ajax({
        type: "POST",
        url: '/Setting/updateFont',
        data: param,
        success: function (data) {
            if (data == 'err') {
                alert('error! 폰트적용 실패');
            } else {
                alert('폰트적용 완료');
                location.reload(true);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var updateFontSubmitBtn = document.querySelector('#updateFontSubmitBtn');
updateFontSubmitBtn.addEventListener('click', updateFontSubmitFunc);

getFontList();

var getPayGuideMessage = function () {
    $.ajax({
        type: "POST",
        url: '/Setting/getPayGuideMessage',
        success: function (data) {
            if (data == 'err') {
                alert('err');
            } else {
                document.querySelector('#Tinymce').value = data;
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getPayGuideMessage();

var updatePayGuideMessageFunc = function () {
    var guideMessage = tinymce.activeEditor.getContent();
    $.ajax({
        type: "POST",
        url: '/Setting/updatePayGuideMessage',
        data: {
            guideMessage: guideMessage
        },
        success: function (data) {
            if (data == 'err') {
                alert('err');
            } else {
                alert('안내문구 변경완료');
                location.reload(true);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
document.querySelector('#updatePayGuideMessageBtn').addEventListener('click', updatePayGuideMessageFunc);
