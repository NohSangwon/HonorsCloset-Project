// DB 'Customer' Insert
var appendMember = function (data) {
    var DataTable = document.getElementById('DataTable');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.id = "checkBox";
    td.id = 'checkbox';
    td.append(checkbox);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'ID';
    td.innerHTML = data.ID;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Specification';
    var Specification = data.Specification;
    var Convert_Specification = "";
    if (Specification == "0") {
        Convert_Specification = "관리자";
    }
    else if (Specification == "1") {
        Convert_Specification = "학생";
    }
    else if (Specification == "2") {
        Convert_Specification = "교직원/교수";
    }
    else {
        Convert_Specification = "그룹 없음";
    }
    td.innerHTML = Convert_Specification;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Name';
    td.innerHTML = data.Name;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'PhoneNum';
    td.innerHTML = PhoneNumberParse(data.PhoneNum);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'E_mail';
    td.innerHTML = data.E_mail;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'RegistDate';
    td.innerHTML = DateParse(data.RegistDate);
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

appendNewMember = function (data) {
    var DataTable = document.getElementById('DataTable_NewMember');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name_New";
    checkbox.value = "value";
    checkbox.id = "checkBox";
    td.id = 'checkbox';
    td.append(checkbox);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'ID';
    td.innerHTML = data.ID;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Specification';
    var Specification = data.Specification;
    var Convert_Specification = "";
    if (Specification == "0") {
        Convert_Specification = "관리자";
    }
    else if (Specification == "1") {
        Convert_Specification = "학생";
    }
    else if (Specification == "2") {
        Convert_Specification = "교직원/교수";
    }
    else {
        Convert_Specification = "그룹 없음";
    }
    td.innerHTML = Convert_Specification;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Name';
    td.innerHTML = data.Name;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'PhoneNum';
    td.innerHTML = PhoneNumberParse(data.PhoneNum);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'E_mail';
    td.innerHTML = data.E_mail;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'RegistDate';
    td.innerHTML = DateParse(data.RegistDate);
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

// DataTable 'Customer' Load Event
$.ajax({
    type: "POST",
    url: '/Member/all',
    success: function (data) {
        var DataTable = document.getElementById('DataTable');
        DataTable.getElementsByTagName('tbody').item(0).remove();
        var Today = new Date();
	var ParseToday = DateParse2(Today);
        var LastWeek = new Date(Today.setDate(Today.getDate() - 7));
	var ParseLastWeek = DateParse2(LastWeek);
        var NewMemberCount = 0;

        for (var i = 0; i < data.length; i++) {
            var RegistDate = data[i].RegistDate;
            if (ParseLastWeek <= RegistDate && RegistDate <= ParseToday) {
                NewMemberCount++;
                appendNewMember(data[i]);
            }
            appendMember(data[i]);
        }

        TotalMember_BreadCrumb(data.length);
        TotalNewMember_BreadCrumb(NewMemberCount);
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// '관리자'로 변경 Event
var Group_Admin = document.getElementById('Group_Admin');
Group_Admin.addEventListener('click', function () {
    // 기존 회원 테이블
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    // 신규 회원 테이블
    var DataTable_NewMember = document.getElementById('DataTable_NewMember');
    var rows_New = DataTable_NewMember.getElementsByTagName('tr');
    var checkbox_New = document.getElementsByName('name_New');

    // 빈 데이터 정의
    var DATA = {
        'ID': ""
    };

    // 기존 회원 테이블
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            DATA['ID'] += DataTable.rows[i + 1].cells[1].innerText + ",";
        }
    }

    // 신규 회원 테이블
    for (var i = 0; i < rows_New.length - 1; i++) {
        if (checkbox_New[i].checked == true) {
            DATA['ID'] += DataTable_NewMember.rows[i + 1].cells[1].innerText + ",";
        }
    }

    $.ajax({
        type: "POST",
        url: '/Member/toAdmin',
        data: DATA,
        traditional: true,
        dataType: 'json',
        async: false,
        success: function (args) {
            alert("적용되었습니다.");
        },
        error: function (e) {
            alert(e.responseText);
        }
    })
    RefreshDataTable();
})

// '학생'으로 변경 Event
var Group_Student = document.getElementById('Group_Student');
Group_Student.addEventListener('click', function () {
    // 기존 회원 테이블
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    // 신규 회원 테이블
    var DataTable_NewMember = document.getElementById('DataTable_NewMember');
    var rows_New = DataTable_NewMember.getElementsByTagName('tr');
    var checkbox_New = document.getElementsByName('name_New');

    // 빈 데이터 정의
    var DATA = {
        'ID': ""
    };

    // 기존 회원 테이블
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            DATA['ID'] += DataTable.rows[i + 1].cells[1].innerText + ",";
        }
    }

    // 신규 회원 테이블
    for (var i = 0; i < rows_New.length - 1; i++) {
        if (checkbox_New[i].checked == true) {
            DATA['ID'] += DataTable_NewMember.rows[i + 1].cells[1].innerText + ",";
        }
    }


    $.ajax({
        type: "POST",
        url: '/Member/toStudent',
        data: DATA,
        traditional: true,
        dataType: 'json',
        async: false,
        success: function (args) {
            alert("적용되었습니다.");
        },
        error: function (e) {
            alert(e.responseText);
        }
    })
    RefreshDataTable();
})

// '교직원/교수'로 변경 Event
var Group_Staff = document.getElementById('Group_Staff');
Group_Staff.addEventListener('click', function () {
    // 기존 회원 테이블
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    // 신규 회원 테이블
    var DataTable_NewMember = document.getElementById('DataTable_NewMember');
    var rows_New = DataTable_NewMember.getElementsByTagName('tr');
    var checkbox_New = document.getElementsByName('name_New');

    // 빈 데이터 정의
    var DATA = {
        'ID': ""
    };

    // 기존 회원 테이블
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            DATA['ID'] += DataTable.rows[i + 1].cells[1].innerText + ",";
        }
    }

    // 신규 회원 테이블
    for (var i = 0; i < rows_New.length - 1; i++) {
        if (checkbox_New[i].checked == true) {
            DATA['ID'] += DataTable_NewMember.rows[i + 1].cells[1].innerText + ",";
        }
    }


    $.ajax({
        type: "POST",
        url: '/Member/toStaff',
        data: DATA,
        traditional: true,
        dataType: 'json',
        async: false,
        success: function (args) {
            alert("적용되었습니다.");
        },
        error: function (e) {
            alert(e.responseText);
        }
    })
    RefreshDataTable();
})

// DataTable tr 클릭시 CheckBox=true Event -- 동적으로 tr에 넣기
$(document).on('click', '#DataTable_NewMember', function (event) {
    var targetTR = event.target.parentElement.closest('tr').rowIndex;
    var checkbox = document.getElementsByName('name_New');

    if (targetTR == 0) {
        var check_all = document.getElementById('check_all_NewMember');
        var DataTable = document.getElementById('DataTable_NewMember');
        if (check_all.checked == true) {
            check_all.checked = false;
            for (var i = 0; i < DataTable.rows.length - 1; i++) {
                checkbox[i].checked = false;
            }
        }
        else {
            check_all.checked = true;
            for (var i = 0; i < DataTable.rows.length - 1; i++) {
                checkbox[i].checked = true;
            }
        }
    }
    else {
        if (checkbox[targetTR - 1].checked == true) {
            checkbox[targetTR - 1].checked = false;
        }
        else {
            checkbox[targetTR - 1].checked = true;
        }
    }
})

// =================== InterFace Function =========================

// BreadCrumb : '전체 회원 수 : X 명'
function TotalMember_BreadCrumb(Amount) {
    var MemberTotal = document.getElementById('TotalMember');
    MemberTotal.innerHTML = '전체 회원 수 : ' + Amount + ' 명';
}

// BreadCrumb : '신규 회원 수 : X 명'
function TotalNewMember_BreadCrumb(Amount) {
    var MemberNew = document.getElementById('TotalNewMember');
    MemberNew.innerHTML = '신규 회원 수 : ' + Amount + ' 명';
}

// String Date를 Date객체로 생성
function DateParse(str) {
    var y = str.substr(0, 4);
    var m = str.substr(5, 2);
    var d = str.substr(8, 2);
    return new Date(y, m - 1, d);
}

// Refresh DataTable Module - All Data
function RefreshDataTable() {
    var DataTable = document.getElementById('DataTable');
    var DataTable_NewMember = document.getElementById('DataTable_NewMember');
    DataTableRowsLength = DataTable.rows.length;
    for (var i = 0; i < DataTableRowsLength - 1; i++) {
        DataTable.deleteRow(1);
    }
    DataTable_NewMemberRowsLength = DataTable_NewMember.rows.length;
    for (var i = 0; i < DataTable_NewMemberRowsLength - 1; i++) {
        DataTable_NewMember.deleteRow(1);
    }

    $.ajax({
        type: "POST",
        url: '/Member/all',
        async: false,
        success: function (data) {
            var DataTable = document.getElementById('DataTable');
            DataTable.getElementsByTagName('tbody').item(0).remove();
            var Today = new Date();
            var LastWeek = new Date(Today.setDate(Today.getDate() - 7));
            var NewMemberCount = 0;

            for (var i = 0; i < data.length; i++) {
                var RegistDate = DateParse2(data[i].RegistDate);
                if (LastWeek <= RegistDate && RegistDate <= Today) {
                    NewMemberCount++;
                    appendNewMember(data[i]);
                }
                appendMember(data[i]);
            }

            TotalMember_BreadCrumb(data.length);
            TotalNewMember_BreadCrumb(NewMemberCount);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

/*InterFace */
function PhoneNumberParse(str){
    a = str.substr(0,3);
    b = str.substr(3,4);
    c = str.substr(7,4);

    return (a + '-' + b + '-' + c);
}

function DateParse(str){
    y = str.substr(0,4);
    m = str.substr(4,2);
    d = str.substr(6,2);

    return (y + '-' + m + '-' + d);
}

function DateParse2(Today){
    y = Today.getFullYear()+'';
    m = leadingZeros(Today.getMonth()+1,2)+'';
    d = Today.getDate()+'';

    return (y+m+d);
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}