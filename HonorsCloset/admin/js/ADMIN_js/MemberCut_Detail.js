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
var seasonName = year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 멤버컷';
seasonNameH.innerHTML = seasonName;

var memberList = null;
$.ajax({
    type: "POST",
    url: '/MemberCut/getMemberList',
    data: {
        seasonCode: seasonCode
    },
    success: function (data) {
        memberList = data;
        createImages();
    },
    error: function (e) {
        alert(e.responseText);
    }
});

var deleteMember = function (season_, name_, department_, imageName_) {
    var season = season_;
    var name = name_;
    var department = department_;
    var imageName = imageName_;
    return function () {
        if (confirm('멤버를 삭제하시겠습니까?')) {
            $.ajax({
                type: "POST",
                url: '/MemberCut/deleteMember',
                data: {
                    season: season,
                    name: name,
                    department: department,
                    imageName: imageName,
                },
                success: function (data) {
                    if (data == 'success') {
                        alert('멤버 삭제완료');
                    } else {
                        alert('err');
                    }
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
    var data = memberList;

    var imageArea = document.querySelector('#imageArea');
    var row = document.createElement('div');
    row.className = 'row';
    imageArea.appendChild(row);


    for (var i = 0; i < data.length; i++) {
        if (i % 3 == 0) {
            var row = document.createElement('div');
            row.className = 'row';
            imageArea.appendChild(row);
        }


        var colDiv = document.createElement('div');
        colDiv.className = 'col-lg-4 col-sm-4 img-item';
        row.appendChild(colDiv);

        var table = document.createElement('table');
        colDiv.appendChild(table);

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
        img.id = "realImg";
        img.src = data[i].Image;
        img.alt = "등록된 이미지가 없습니다";
        td.appendChild(img);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.className = "text-left text-bold";
        var p = document.createElement('p');
        p.innerHTML = data[i].Name;
        td.appendChild(p);
        var p = document.createElement('p');
        p.innerHTML = data[i].Department;
        td.appendChild(p);
        tr.appendChild(td);

        var td = document.createElement('td');
        var deleteBtn = document.createElement('button');
        deleteBtn.className = "deleteImgBtn btn btn-primary";
        deleteBtn.id = data[i].Image;
        deleteBtn.innerHTML = "X";
        deleteBtn.addEventListener('click', deleteMember(seasonCode, data[i].Name, data[i].Department, data[i].Image));
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
    var row = document.createElement('div');
    row.className = 'row imgSection';
    row.id = 'imgSection';
    addImgArea.appendChild(row);

    // original
    var col = document.createElement('div');
    col.className = 'col-lg-10 col-sm-10';
    row.appendChild(col);

    var table = document.createElement('table');
    table.className = "text-center mb-3";
    table.style = "width: 100%";
    col.appendChild(table);

    var colgroup = document.createElement('colgroup');
    var col = document.createElement('col');
    col.width = '30%';
    colgroup.appendChild(col);
    var col = document.createElement('col');
    col.width = '30%';
    colgroup.appendChild(col);
    var col = document.createElement('col');
    col.width = '40%';
    colgroup.appendChild(col);
    table.appendChild(colgroup);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    var input = document.createElement('input');
    input.id = 'name';
    input.className = 'form-control mb-1';
    input.type = 'text';
    input.placeholder = '이름';
    td.appendChild(input);
    var input = document.createElement('input');
    input.id = 'department';
    input.className = 'form-control';
    input.type = 'text';
    input.placeholder = '학과';
    td.appendChild(input);
    tr.appendChild(td);

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
    addInputAreaBtn.className = "btn-account btn btn-primary mt-2";
    addInputAreaBtn.id = "addInputAreaBtn";
    addInputAreaBtn.innerHTML = '입력란 추가';
    addInputAreaBtn.addEventListener('click', addInputSection);

    addImgArea.appendChild(addInputAreaBtn);
};

document.querySelector('#addInputAreaBtn').addEventListener('click', addInputSection);

var getNewMemberList = function () {
    var newMemberList = [];

    var inputTableList = document.querySelector('#addImgArea').querySelectorAll('table');
    if (inputTableList.value == null || realImgInputList.value == undefined || realImgInputList.value == '') {
        for (var i = 0; i < inputTableList.length; i++) {
            var name = inputTableList[i].querySelector('#name').value;
            var department = inputTableList[i].querySelector('#department').value;
            var member = {
                name: name,
                department: department
            }
            if (name == '' || department == '') {
                alert('error! 이름과 학과는 필수 입력값입니다.');
                return null;
            }
            if (name.length > 20) {
                alert('error! 이름은 20자 까지만 입력가능합니다.');
                return null;
            }
            if (department.length > 20) {
                alert('error! 학과는 20자 까지만 입력가능합니다.');
                return null;
            }
            newMemberList.push(member);
        }
    }

    return newMemberList;
}

var insertNewImgFunc = function () {
    var newMemberList = getNewMemberList();
    if (newMemberList == null) return;
    var realImgInputList = document.querySelectorAll('#realImgInput');
    if (realImgInputList.length <= 0) {
        alert('error! 입력된 멤버가 없습니다')
        return;
    }
    for (var i = 0; i < realImgInputList.length; i++) {
        if (realImgInputList[i].value == null || realImgInputList[i].value == undefined || realImgInputList[i].value == '') {
            alert('error! 이미지가 입력이 안된 멤버가 있습니다');
            return;
        } else {
            var value = realImgInputList[i].value.replace(/\\/g, '/');
            var indexOfPoint = value.indexOf('.');
            var subEx = value.substring(indexOfPoint + 1, value.length);
            if (subEx == 'jpg' || subEx == 'jpeg' || subEx == 'png' || subEx == 'JPG' || subEx == 'JPEG' || subEx == 'PNG') {
                continue;
            } else {
                alert('.jpg .jpeg .png 파일만 업로드 가능합니다');
                return;
            }
        }
    }

    var isOverlap = 0;
    $.ajax({
        type: "POST",
        url: '/MemberCut/checkOverlap',
        data: {
            seasonCode: seasonCode,
            newMemberList: newMemberList
        },
        async: false,
        success: function (data) {
            if (data.length == 0) return;

            isOverlap = 1;
            var message = '';
            for (var i = 0; i < data.length; i++) {
                message += newMemberList[data[i].index].name + ', ' + newMemberList[data[i].index].department + ' : 은 이미 등록된 멤버입니다.\n';
            }
            alert(message);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
    if (isOverlap == 1) return;

    $.ajax({
        type: "POST",
        url: '/MemberCut/insertMember',
        data: {
            seasonCode: seasonCode,
            newMemberList: newMemberList
        },
        async: false,
        success: function (data) {
            //            alert(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    var cnt = realImgInputList.length;
    $('#imgInsertForm').ajaxForm({
        url: "/MemberCut/insertImg/" + seasonCode + "/" + cnt,
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
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
    $("#imgInsertForm").submit();
};
document.querySelector('#insertNewImgBtn').addEventListener('click', insertNewImgFunc);

var deleteBehindcutFunc = function (season_) {
    if (confirm(year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 멤버컷을 삭제하시겠습니까?')) {
        $.ajax({
            type: "POST",
            url: '/MemberCut/deleteMemberCut',
            data: {
                seasonCode: seasonCode,
            },
            success: function (data) {
                alert(year + ' ' + (season == '1' ? 'Spring' : 'Fall') + ' 멤버컷을 삭제하였습니다');
                window.location.href = 'MemberCut';
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
document.querySelector('#deleteBehindcutBtn').addEventListener('click', deleteBehindcutFunc);
