// DB 'Product' Insert
var check_allFunc = function (e) {
    e.stopPropagation();
    var check_all = document.getElementById('check_all');
    var DataTable = document.getElementById('DataTable');
    var checkbox = document.getElementsByName('name');
    if (check_all.checked == false) {
        check_all.checked = false;
        for (var i = 0; i < DataTable.rows.length - 1; i++) {
            checkbox[i].checked = false;
        }
    } else {
        check_all.checked = true;
        for (var i = 0; i < DataTable.rows.length - 1; i++) {
            checkbox[i].checked = true;
        }
    }
};
check_all = document.getElementById('check_all');
check_all.addEventListener('click', check_allFunc);

var appendProduct = function (data) {
    var DataTable = document.getElementById('DataTable');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.id = "checkBox";
    checkbox.addEventListener('click', function (e) {
        e.stopPropagation();
    });
    td.id = 'checkbox';
    td.appendChild(checkbox);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Code';
    var a = document.createElement('a');
    a.href = 'ProductInfo?' + 'Code=' + data.Code;
    a.innerHTML = data.Code;
    a.addEventListener('mouseenter', OverThumbnailEvent);
    a.addEventListener('mouseout', OverThumbnailOutEvent);
    td.appendChild(a);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'RegistDate';
    td.innerHTML = DateParse(data.RegistDate);
    tr.appendChild(td);

    var td = document.createElement('td');
    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'Specification_hidden';
    hidden.value = data.Specification;
    hidden.id = 'Specification';
    td.id = 'Specification';
    td.appendChild(hidden);

    var td = document.createElement('td');
    td.id = 'FirstPrice';
    td.innerHTML = comma(data.FirstPrice) + '원';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'DiscountRate';
    td.innerHTML = data.DiscountRate * 100 + '%';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'LastPrice';
    td.innerHTML = comma(data.LastPrice) + '원';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Progress';
    var Progress = data.Progress;
    var Convert_Progress = "";
    if (Progress == "0") {
        Convert_Progress = "등록 완료";
    } else if (Progress == "1") {
        Convert_Progress = "판매 중";
    } else if (Progress == "2") {
        Convert_Progress = "입금 대기";
    } else if (Progress == "3") {
        Convert_Progress = "판매 완료";
    } else if (Progress == "4") {
        Convert_Progress = "감모 손실";
    } else if (Progress == "9") {
        Convert_Progress = "삭제 완료";
    } else {
        Convert_Progress = "Error";
    }
    td.innerHTML = Convert_Progress;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'addPencilButton';
    var iTag = document.createElement('i');
    iTag.className = 'fas fa-edit';
    iTag.style.width = '20px';
    iTag.style.height = '20px';
    td.appendChild(iTag);
    td.addEventListener('click', InfoOverlayWrapperClick(data.Code));
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

// DataTable 'Product' Load Event
$.ajax({
    type: "POST",
    url: '/getProducts/all',
    success: function (data) {
        var DataTable = document.getElementById('DataTable');
        //    DataTable.getElementsByTagName('tbody').item(0).remove();
        var tbody = DataTable.querySelector('tbody');
        tbody.parentNode.removeChild(tbody);

        for (var i = 0; i < data.length; i++) {
            appendProduct(data[i]);
        }
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// 총 재고 갯수 Load - BreadCrumbs
$.ajax({
    type: "POST",
    url: '/getProducts/AllCount',
    success: function (data) {
        var StockCount = document.getElementById('StockCount');
        StockCount.innerHTML = '총 재고 수 : ' + data[0].cnt + ' 개';
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// 미판매 재고 갯수 Load - BreadCrumbs
$.ajax({
    type: "POST",
    url: '/getProducts/UnSellCount',
    success: function (data) {
        var UnSellCount = document.getElementById('UnSellCount');
        UnSellCount.innerHTML = '미판매 재고 수 : ' + data[0].cnt + ' 개';
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// 감모손실 갯수 Load - BreadCrumbs
$.ajax({
    type: "POST",
    url: '/getProducts/LossCount',
    success: function (data) {
        var LossCount = document.getElementById('LossCount');
        LossCount.innerHTML = '감모손실 수 : ' + data[0].cnt + ' 개';
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// 판매 갯수 Load - BreadCrumbs
$.ajax({
    type: "POST",
    url: '/getProducts/SellCount',
    success: function (data) {
        var SellCount = document.getElementById('SellCount');
        SellCount.innerHTML = '판매 수 : ' + data[0].cnt + ' 개';
    },
    error: function (e) {
        alert(e.responseText);
    }
});

// 할인율 20% 적용 Event
var Discount_First = document.getElementById('Discount_first');
Discount_First.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': "",
        'DiscountRate': "0.2",
        'LastPrice': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시      
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
            Codes['LastPrice'] += commaBack(CurrentRow.cells[3].innerText.split('원')[0]) + ",";
            console.log(Codes);
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/DiscountRate',
        data: Codes,
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

// 할인율 35% 적용 Event
var Discount_Second = document.getElementById('Discount_second');
Discount_Second.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': "",
        'DiscountRate': "0.35",
        'LastPrice': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시      
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
            Codes['LastPrice'] += commaBack(CurrentRow.cells[3].innerText.split('원')[0]) + ",";
            console.log(Codes);
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/DiscountRate',
        data: Codes,
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

// 할인율 50% 적용 Event
var Discount_Third = document.getElementById('Discount_third');
Discount_Third.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': "",
        'DiscountRate': "0.5",
        'LastPrice': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시      
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
            Codes['LastPrice'] += commaBack(CurrentRow.cells[3].innerText.split('원')[0]) + ",";
            console.log(Codes);
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/DiscountRate',
        data: Codes,
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

// 할인율 임의 적용 Event
var Discount_User = document.getElementById('Discount_User');
Discount_User.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var DiscountRate = document.getElementById('Discount_Rate_User').value;
    // 예외처리 - DiscountRate의 범위 오류 (1~100)
    if (DiscountRate < 0 || DiscountRate > 100 || (DiscountRate % 1) != 0) {
        alert('할인율은 0이상, 100이하의 자연수로 작성해주세요.');
        return;
    }

    var Codes = {
        'Code': "",
        'DiscountRate': DiscountRate / 100,
        'LastPrice': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시      
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
            Codes['LastPrice'] += commaBack(CurrentRow.cells[3].innerText.split('원')[0]) + ",";
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/DiscountRate',
        data: Codes,
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

// 특가 할인 (3000원) 적용 Event
var Discount_Special = document.getElementById('Discount_Special');
Discount_Special.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': "",
        'DiscountRate': "",
        'LastPrice': "3000"
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
            Codes['DiscountRate'] += (1 - (3000 / commaBack(CurrentRow.cells[3].innerText.split('원')[0]))).toFixed(3) + ',';
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/DiscountSpecial',
        data: Codes,
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

// 감모 손실 적용 Event
var Loss_Button = document.getElementById('Loss_Button');
Loss_Button.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            var CurrentRow = DataTable.rows[i + 1];
            // 예외처리 - 판매 완료된 상품 수정시
            if (CurrentRow.cells[6].innerText == "판매 완료") {
                alert('판매 완료된 상품이 포함되어있습니다.');
                return;
            }
            Codes['Code'] += CurrentRow.cells[1].innerText + ",";
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 수정 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/Loss',
        data: Codes,
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


// 탭 변경 Event - jQuery
$("a[data-toggle='tab']").on("show.bs.tab", function (event) {
    // event = tab click Event
    var TabId = event.target.id;
    var Specification = TabId.substring(4, TabId.length);
    var DATA = {
        "Specification": Specification
    }
    $.ajax({
        type: "POST",
        url: '/getProducts/BySpecification',
        data: DATA,
        success: function (data) {
            var DataTable = document.getElementById('DataTable');
            var tbody = DataTable.querySelector('tbody');
            tbody.parentNode.removeChild(tbody);
            // DataTable 초기화
            DataTableRowsLength = DataTable.rows.length;
            for (var i = 0; i < DataTableRowsLength - 1; i++) {
                DataTable.deleteRow(1);
            }
            // Append
            for (var i = 0; i < data.length; i++) {
                appendProduct(data[i]);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    })
});

// 등록 버튼 Event
var Stock_Add_Button = document.getElementById('Stock_Add_Button');
Stock_Add_Button.addEventListener('click', function () {
    var OverlayWrapper = document.getElementById('OverlayWrapper');
    OverlayWrapper.style.display = 'inline-block';
})

// 등록 Overlay - 등록 Button Event
var Stock_Add_OK_Button = document.getElementById('Stock_Add_OK_Button');
Stock_Add_OK_Button.addEventListener('click', function (event) {
    // 부모 요소의 이벤트 제거
    event.stopPropagation();

    var Specification = document.getElementsByName('Specification');
    var SpecificationValue = "";
    var Sex = document.getElementsByName('Sex');
    var SexValue = "";
    var Status = document.getElementsByName('Status');
    var StatusValue = "";

    for (var i = 0; i < Specification.length; i++) {
        if (Specification[i].checked) {
            SpecificationValue = Specification[i].value;
            break;
        }
    }
    // 예외처리 - Specification 미선택시 
    if (SpecificationValue == "") {
        alert('분류를 선택해주세요.');
        return;
    }

    for (var i = 0; i < Sex.length; i++) {
        if (Sex[i].checked) {
            SexValue = Sex[i].value;
            break;
        }
    }
    // 예외처리 - Sex 미선택시 
    if (SexValue == "") {
        alert('성별을 선택해주세요.');
        return;
    }

    for (var i = 0; i < Status.length; i++) {
        if (Status[i].checked) {
            StatusValue = Status[i].value;
            break;
        }
    }
    // 예외처리 - Status 미선택시 
    if (StatusValue == "") {
        alert('상태를 선택해주세요.');
        return;
    }

    var Code = SpecificationValue + SexValue + StatusValue;
    var RegistDate = "";
    RegistDate = DateString(document.getElementById('RegistDate').value);
    var FirstPrice = "";
    FirstPrice = document.getElementById('FirstPrice').value;
    var LastPrice = "";
    LastPrice = document.getElementById('FirstPrice').value;

    // 예외처리 - 가격 미입력시 
    if (FirstPrice == "" || LastPrice == "") {
        alert('가격을 입력해주세요.');
        return;
    }
    // 예외처리 - 가격이 숫자가 아닐경우
    if (is_number(FirstPrice) == false) {
        alert('가격은 숫자만 입력할 수 있습니다.');
        return;
    }
    // 예외처리 - 입고일 미입력시
    if (RegistDate == "") {
        alert('입고일을 선택해주세요.');
        return;
    }

    var DATA1 = {
        "Code": Code
    };

    // 코드 순서번호 작업 (동기식)
    $.ajax({
        type: "POST",
        url: '/getProducts/Count',
        data: DATA1,
        traditional: true,
        dataType: "json",
        async: false,
        success: function (data) {
            Code = data.Result;
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    var URL = "/addProduct/insert/" + Code + "/" + SpecificationValue + "/" + RegistDate + "/" + FirstPrice + "/" + LastPrice;

    // File을 업로드하는 Ajax
    $('#Insert_form').ajaxForm({
        url: URL,
        enctype: "multipart/form-data",
        beforeSubmit: function (data, form, option) {
            //validation체크 
            //막기위해서는 return false를 잡아주면됨
            return true;
        },
        success: function (response, status) {
            alert('등록이 완료되었습니다.');
            location.reload();
        },
        error: function () {
            //에러발생을 위한 code페이지
        }
    });
    $("#Insert_form").submit();
});

// 오프라인 판매 버튼
var Stock_toOffline = document.getElementById("Stock_toOffline");
Stock_toOffline.addEventListener('click',function(event){
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            Codes['Code'] += DataTable.rows[i + 1].cells[1].innerText + ",";
            // 예외처리 - 판매완료된 재고 오프라인 판매 불가
            if (DataTable.rows[i + 1].cells[6].innerText == '판매 완료') {
                alert('판매 완료된 재고는 변경할 수 없습니다.');
                return;
            }
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 변경 X
    if (Codes['Code'] == "") {
        alert('변경할 항목이 없습니다.');
        return;
    }

    $.ajax({
        type: "POST",
        url: '/updateProducts/toOffline',
        data: Codes,
        traditional: true,
        dataType: 'json',
        success: function (args) {
            alert("판매중으로 변경되었습니다.");
            RefreshDataTable();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
})

// 등록 Overlay - 취소 Button Event
var Stock_ADD_Cancel_Button = document.getElementById("Stock_ADD_Cancel_Button");
Stock_ADD_Cancel_Button.addEventListener('click', function (event) {
    // 부모 요소의 이벤트 제거
    event.stopPropagation();

    var OverlayWrapper = document.getElementById('OverlayWrapper');
    OverlayWrapper.style.display = 'none';
})

// 삭제 버튼 Event
var Stock_Delete_Button = document.getElementById('Stock_Delete_Button');
Stock_Delete_Button.addEventListener('click', function () {
    var DataTable = document.getElementById('DataTable');
    var rows = DataTable.getElementsByTagName('tr');
    var checkbox = document.getElementsByName('name');
    var Codes = {
        'Code': ""
    };
    for (var i = 0; i < rows.length - 1; i++) {
        if (checkbox[i].checked == true) {
            Codes['Code'] += DataTable.rows[i + 1].cells[1].innerText + ",";
            // 예외처리 - 판매완료된 재고 삭제시 삭제 X
            if (DataTable.rows[i + 1].cells[6].innerText == '판매 완료') {
                alert('판매 완료된 재고는 삭제할 수 없습니다.');
                return;
            }
        }
    }

    // 예외처리 - 선택한 항목이 없을경우 삭제 X
    if (Codes['Code'] == "") {
        alert('삭제할 항목이 없습니다.');
        return;
    }

    // confirm => 확인 -> 삭제
    if(confirm('정말로 삭제하시겠습니까?')==true){
    
        $.ajax({
            type: "POST",
            url: '/deleteProducts/ByCode',
            data: Codes,
            traditional: true,
            dataType: 'json',
            success: function (args) {
                alert("삭제되었습니다.");
                RefreshDataTable();
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
})

// DataTable MouseOver시 Thumbnail 노출
function OverThumbnailEvent(event) {
    var target_Code = event.target.innerHTML;

    var Over_div = document.getElementById('Over_div');
    Over_div.style.top = event.pageY + 10 + 'px';
    Over_div.style.left = event.pageX + 10 + 'px';
    Over_div.style.display = 'inline-block';

    var Over_Thumbnail = document.createElement('img');
    Over_Thumbnail.id = 'Over_Thumbnail';
    Over_Thumbnail.style.width = '200px';
    Over_Thumbnail.style.height = '200px';
    Over_Thumbnail.src = '../src/product/' + target_Code + '/' + target_Code + '-0.jpg';

    Over_Thumbnail.onerror = function () {
        Over_Thumbnail.style.display = 'none';
        Over_div.style.display = 'none';
    };

    Over_div.appendChild(Over_Thumbnail);
}

// DataTable MouseOut시 Thumbnail 삭제
function OverThumbnailOutEvent() {
    Over_div = document.getElementById('Over_div');
    Over_Thumbnail = document.getElementById('Over_Thumbnail');

    Over_div.removeChild(Over_Thumbnail);
    Over_div.style.display = 'none';
}

// Search Module
var DataTableSearch = document.getElementById('DataTableSearch');
DataTableSearch.addEventListener('keypress', function (event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // is Enter?
        var SearchWord = document.getElementById('DataTableSearch').value;
        if (SearchWord == '') {
            RefreshDataTable();
        } else {
            RefreshDataTableByWord(SearchWord);
        }
    } else {
        //Do Nothing...
    }
})

// Refresh DataTable Module - All Data
function RefreshDataTable() {
    var DataTable = document.getElementById('DataTable');
    DataTableRowsLength = DataTable.rows.length;
    for (var i = 0; i < DataTableRowsLength - 1; i++) {
        DataTable.deleteRow(1);
    }

    $.ajax({
        type: "POST",
        url: '/getProducts/all',
        async: false,
        success: function (data) {
            var DataTable = document.getElementById('DataTable');
            var tbody = DataTable.querySelector('tbody');
            tbody.parentNode.removeChild(tbody);

            for (var i = 0; i < data.length; i++) {
                appendProduct(data[i]);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

// Refresh DataTable Module - by KeyWord ( using Search ) - Data.Code
function RefreshDataTableByWord(word) {
    // Remove already Exist Data

    var DataTable = document.getElementById('DataTable');
    DataTableRowsLength = DataTable.rows.length;
    for (var i = 0; i < DataTableRowsLength - 1; i++) {
        DataTable.deleteRow(1);
    }

    $.ajax({
        type: "POST",
        url: '/getProducts/all',
        async: false,
        success: function (data) {
            var DataTable = document.getElementById('DataTable');
            var tbody = DataTable.querySelector('tbody');
            tbody.parentNode.removeChild(tbody);

            for (var i = 0; i < data.length; i++) {
                if (data[i].Code.indexOf(word) != -1) {
                    appendProduct(data[i]);
                }
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

// OverlayWarapper 클릭시 창 닫기
var OverlayWrapper = document.getElementById('OverlayWrapper');
OverlayWrapper.addEventListener('click', function () {
    OverlayWrapper.style.display = 'none';
})

var OverlayContentWrapper = document.getElementById('OverlayContentWrapper');
OverlayContentWrapper.addEventListener('click', function (event) {

    // 부모 요소의 이벤트 제거
    event.stopPropagation();
})

// InfoOverlayWrapper
function InfoOverlayWrapperClick(code_) {
    var code = code_;

    return function (event) {
        event.stopPropagation();
        //        var DataTable = document.getElementById('DataTable');
        //    var targetTR = event.target.parentElement.closest('tr').rowIndex;
        //    var Code = DataTable.rows[targetTR].cells[1].innerText;
        var DATA = {
            'Code': code
        };

        $.ajax({
            type: "POST",
            url: '/Info/getInfo',
            data: DATA,
            async: false,
            success: function (data) {
                var Info = document.getElementById("Info");
                Info.value = data[0].Info;
                tinymce.init({
                    selector: '#Info',
                    language: 'ko_KR',
                    width: 1300,
                    height: 400
                });
            },
            error: function (e) {
                alert(e.responseText);
            }
        });

        var InfoOverlayWrapper = document.getElementById('InfoOverlayWrapper');
        InfoOverlayWrapper.style.display = 'inline-block';

        // Info Code 세팅
        var InfoCode = document.getElementById('InfoCode');
        InfoCode.innerHTML = '코드 : ' + code;
    }
}

var Info_Update_OK_Button = document.getElementById('Info_Update_OK_Button');
Info_Update_OK_Button.addEventListener('click', function (Code) {
    var Code = document.getElementById('InfoCode').innerText.substr(5, 6);
    var InfoString = tinymce.activeEditor.getContent();
    var DataTable = document.getElementById('DataTable');
    for (var i = 0; i < DataTable.rows.length - 1; i++) {
        if (DataTable.rows[i].cells[1].innerText == Code) {
            if (DataTable.rows[i].cells[6].innerText == '판매 완료') {
                alert('판매 완료된 상품은 글쓰기를 할 수 없습니다.')
                return;
            } else {
                break;
            }
        }
    }

    var DATA = {
        'Code': Code,
        'Info': InfoString
    };

    $.ajax({
        type: "POST",
        url: '/Info/updateInfo',
        data: DATA,
        async: false,
        success: function (data) {
            alert('등록되었습니다.');
            location.reload();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
});

var Info_Update_Cancel_Button = document.getElementById('Info_Update_Cancel_Button');
Info_Update_Cancel_Button.addEventListener('click', function () {
    var InfoOverlayWrapper = document.getElementById('InfoOverlayWrapper');
    InfoOverlayWrapper.style.display = 'none';

    tinymce.remove();
});

//Interface
function is_number(v) {
    var reg = /^(\s|\d)+$/;
    return reg.test(v);
}

function DateParse(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);

    return (y + '-' + m + '-' + d);
}

function DateString(str){
    var y = str.substr(0, 4);
    var m = str.substr(5, 2);
    var d = str.substr(8, 2);
    
    return (y+m+d);
}

function comma(num) {
    var len, point, str;

    num = num + "";
    point = num.length % 3;
    len = num.length;

    str = num.substring(0, point);
    while (point < len) {
        if (str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }

    return str;
}

function commaBack(str) {
    var splited = str.split(',');

    var Num = 0;
    for (var i = 0; i < splited.length; i++) {
        Num += splited[i];
    }

    return Num;
}
