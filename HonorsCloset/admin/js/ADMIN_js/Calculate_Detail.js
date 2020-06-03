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

// initialize 정산
var year = '20' + params[0].substring(0, 2);
var seasonType = params[0].substring(3, 4);
var fromMonth = 0;
var toMonth = 0;

var fromDay = '';
var toDay = '';
if (seasonType == '1') {
    var fromMonth = 0;
    var toMonth = 5;
    document.querySelector('#seasonNameH').innerHTML = String(year) + ' Spring 정산';
} else {
    var fromMonth = 6;
    var toMonth = 11;
    document.querySelector('#seasonNameH').innerHTML = String(year) + ' Fall 정산';
}
var date = new Date(year, fromMonth, 1);
fromDay = date.getDate();
var date = new Date(year, toMonth + 1, 0);
toDay = date.getDate();

document.querySelector('#fromYear').value = year;
document.querySelector('#fromMonth').querySelectorAll('option')[fromMonth].selected = true;
document.querySelector('#fromDay').value = fromDay;

document.querySelector('#toYear').value = year;
document.querySelector('#toMonth').querySelectorAll('option')[toMonth].selected = true;
document.querySelector('#toDay').value = toDay;

var changeToMonthEvent = function () {
    var month = document.querySelector('#toMonth').value;
    var date = new Date(year, month, 0);
    toDay = date.getDate();
    document.querySelector('#toDay').value = toDay;
}
document.querySelector('#toMonth').addEventListener('change', changeToMonthEvent);

var isCalculate = '0';
var totalRestStockAmount = 0;
var totalRestStockPrice = 0;


$.ajax({
    type: "POST",
    url: '/Calculate/getCalculate',
    async: false,
    data: {
        seasonCode: params[0]
    },
    success: function (data) {
        if (data[0].StartDate != null) {
            isCalculate = '1';

            totalRestStockAmount = data[0].TotalStockAmount;
            totalRestStockPrice = data[0].TotalStockPrice;

            var year = data[0].StartDate.substring(0, 4);
            var fromMonth = data[0].StartDate.substring(4, 6);
            var fromDay = data[0].StartDate.substring(6, 8);

            document.querySelector('#fromYear').value = year;
            document.querySelector('#fromMonth').querySelectorAll('option')[Number(fromMonth) - 1].selected = true;
            document.querySelector('#fromDay').value = fromDay;

            var year = data[0].EndDate.substring(0, 4);
            var toMonth = data[0].EndDate.substring(4, 6);
            var toDay = data[0].EndDate.substring(6, 8);

            document.querySelector('#toYear').value = year;
            document.querySelector('#toMonth').querySelectorAll('option')[Number(toMonth) - 1].selected = true;
            document.querySelector('#toDay').value = toDay;

            $("#fromMonth").attr("onFocus", "this.initialSelect = this.selectedIndex");
            $("#fromMonth").attr("onChange", "this.selectedIndex = this.initialSelect");
            $("#toMonth").attr("onFocus", "this.initialSelect = this.selectedIndex");
            $("#toMonth").attr("onChange", "this.selectedIndex = this.initialSelect");

            document.querySelector('#toMonth').removeEventListener('change', changeToMonthEvent);

            var submitCalculateBtn = document.querySelector('#submitCalculateBtn');
            submitCalculateBtn.parentNode.removeChild(submitCalculateBtn);
        }
    },
    error: function (e) {
        alert(e.responseText);
    }
});
var currTabSpec = 'A';

var totalFirstPriceAmount = 0;
var totalLastPriceAmount = 0;
var totalDiscountAmount = 0;
var totalLossAmount = 0;
var totalStockAmount = 0;
var totalStockPriceAmount = 0;

//- initialize 정산
// initialize 현금흐름표
var itemGroupList = [];
var itemGroup = {
    name: '상품 현금 판매',
    amount: 0,
    itemList: []
};
itemGroupList.push(itemGroup);

var itemGroup = {
    name: '상품 계좌 판매',
    amount: 0,
    itemList: []
};
itemGroupList.push(itemGroup);
//- initialize 현금흐름표

var refreshTotalElements = function () {
    var priceStr = String(totalFirstPriceAmount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    document.querySelector('#totalFirstPriceAmount').innerHTML = priceStr + '원';

    var priceStr = String(totalLastPriceAmount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    document.querySelector('#totalLastPriceAmount').innerHTML = priceStr + '원';

    var priceStr = String(totalDiscountAmount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    document.querySelector('#totalDiscountAmount').innerHTML = priceStr + '원';

    var priceStr = String(totalLossAmount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    document.querySelector('#totalLossAmount').innerHTML = '-' + priceStr + '원';

    document.querySelector('#totalStockAmount').innerHTML = totalStockAmount;

    var priceStr = String(totalStockPriceAmount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    document.querySelector('#totalStockPriceAmount').innerHTML = priceStr + '원';
}

var appendNormalProduct = function (data, index) {
    var DataTable = document.querySelector('#DataTable');
    var tbody = DataTable.querySelector('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.id = 'No';
    td.innerHTML = index + 1;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Progress';
    td.innerHTML = "재고";
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Code';
    var a = document.createElement('a');
    a.innerHTML = data.Code;
    a.addEventListener('mouseover', OverThumbnailEvent);
    a.addEventListener('mouseout', OverThumbnailOutEvent);
    td.appendChild(a);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'FirstPrice';
    td.className = 'text-right';
    totalFirstPriceAmount += Number(data.FirstPrice);
    var priceStr = String(data.FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'DiscountAmount';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'LastPrice';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'lossAmount';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stock';
    totalStockAmount++;
    td.innerHTML = '1';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stockPrice';
    td.className = 'text-right';
    totalStockPriceAmount += Number(data.FirstPrice);
    var priceStr = String(data.FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

var appendSalsedProduct = function (data, index) {
    var DataTable = document.querySelector('#DataTable');
    var tbody = DataTable.querySelector('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.id = 'No';
    td.innerHTML = index + 1;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Progress';
    var Progress = data.Progress;
    var Convert_Progress = "";
    if (data.isCash == '1') {
        Convert_Progress = "현금 판매";
        itemGroupList[0].amount += Number(data.LastPrice);
    } else {
        Convert_Progress = "계좌 판매";
        itemGroupList[1].amount += Number(data.LastPrice);
    }
    td.innerHTML = Convert_Progress;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Code';
    var a = document.createElement('a');
    a.innerHTML = data.Code;
    a.addEventListener('mouseover', OverThumbnailEvent);
    a.addEventListener('mouseout', OverThumbnailOutEvent);
    td.appendChild(a);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'FirstPrice';
    td.className = 'text-right';
    totalFirstPriceAmount += Number(data.FirstPrice);
    var priceStr = String(data.FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'DiscountAmount';
    td.className = 'text-right';
    totalDiscountAmount += Number(data.FirstPrice - data.LastPrice);
    var priceStr = String(data.FirstPrice - data.LastPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'LastPrice';
    td.className = 'text-right';
    totalLastPriceAmount += Number(data.LastPrice);
    var priceStr = String(data.LastPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'lossAmount';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stock';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stockPrice';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

var appendLossProduct = function (data, index) {
    var DataTable = document.querySelector('#DataTable');
    var tbody = DataTable.querySelector('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.id = 'No';
    td.innerHTML = index + 1;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Progress';
    td.innerHTML = "감모";
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'Code';
    var a = document.createElement('a');
    a.innerHTML = data.Code;
    a.addEventListener('mouseover', OverThumbnailEvent);
    a.addEventListener('mouseout', OverThumbnailOutEvent);
    td.appendChild(a);
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'FirstPrice';
    td.className = 'text-right';
    totalFirstPriceAmount += Number(data.FirstPrice);
    var priceStr = String(data.FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'DiscountAmount';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'LastPrice';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'lossAmount';
    td.className = 'text-right';
    totalLossAmount += Number(data.FirstPrice);
    var priceStr = String(data.FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    td.innerHTML = '-' + priceStr;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stock';
    td.innerHTML = '0';
    tr.appendChild(td);

    var td = document.createElement('td');
    td.id = 'stockPrice';
    td.className = 'text-right';
    td.innerHTML = '0';
    tr.appendChild(td);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

var appendRestStockInfo = function () {
    var DataTable = document.querySelector('#DataTable');
    var tbody = DataTable.querySelector('tbody');
    var tr = document.createElement('tr');

    var th = document.createElement('th');
    th.id = 'No';
    th.innerHTML = '+';
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'Progress';
    th.innerHTML = "잔여재고재산";
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'Code';
    th.innerHTML = "[재고재산 총합]";
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'FirstPrice';
    th.className = 'text-right';
    totalFirstPriceAmount += Number(totalRestStockPrice);
    var priceStr = String(totalRestStockPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    th.innerHTML = priceStr + '원';
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'DiscountAmount';
    th.className = 'text-right';
    th.innerHTML = '0';
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'LastPrice';
    th.className = 'text-right';
    th.innerHTML = '0';
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'lossAmount';
    th.className = 'text-right';
    th.innerHTML = '0';
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'stock';
    totalStockAmount += Number(totalRestStockAmount);
    th.innerHTML = totalRestStockAmount;
    tr.appendChild(th);

    var th = document.createElement('th');
    th.id = 'stockPrice';
    th.className = 'text-right';
    totalStockPriceAmount += Number(totalRestStockPrice);
    var priceStr = String(totalRestStockPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    th.innerHTML = priceStr + '원';
    tr.appendChild(th);

    tbody.appendChild(tr);
    DataTable.appendChild(tbody);
}

// DataTable 'Product' Load Event
RefreshDataTable();

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

// 탭 변경 Event - jQuery
$("a[data-toggle='tab']").on("show.bs.tab", function (event) {
    // event = tab click Event
    var TabId = event.target.id;
    currTabSpec = TabId.substring(4, TabId.length);

    var SearchWord = document.getElementById('DataTableSearch').value;
    if (SearchWord == '') {
        RefreshDataTable();
    } else {
        RefreshDataTableByWord(SearchWord);
    }
});

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
    var fromYear = document.querySelector('#fromYear').value;
    var fromMonth = document.querySelector('#fromMonth').value;
    if (fromMonth.length == 1)
        fromMonth = '0' + fromMonth;
    var fromDay = document.querySelector('#fromDay').value;
    if (fromDay.length == 1)
        fromDay = '0' + fromDay;

    var toYear = document.querySelector('#toYear').value;
    var toMonth = document.querySelector('#toMonth').value;
    if (toMonth.length == 1)
        toMonth = '0' + toMonth;
    var toDay = document.querySelector('#toDay').value;
    if (toDay.length == 1)
        toDay = '0' + toDay;

    var fromDate = fromYear + fromMonth + fromDay + '000000';
    var toDate = toYear + toMonth + toDay + '235959';
    if (fromDate > toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
        return;
    }

    var fromCode = document.querySelector('#fromCode').value;
    var toCode = document.querySelector('#toCode').value;

    if (fromCode == '' && toCode == '') {
        fromCode = 'AAA000';
        toCode = 'ZZZ999';
    } else {
        if (fromCode.match(/\w\w\w\d\d\d/) == null) {
            alert('시작코드를 올바르게 입력해주세요');
            return;
        }
        if (toCode.match(/\w\w\w\d\d\d/) == null) {
            alert('끝코드를 올바르게 입력해주세요');
            return;
        }

        if (fromCode == '')
            fromCode = 'AAA000';
        if (toCode == '')
            toCode = 'ZZZ999';
    }

    var DataTable = document.getElementById('DataTable');
    DataTableRowsLength = DataTable.rows.length;
    for (var i = 0; i < DataTableRowsLength - 1; i++) {
        DataTable.deleteRow(1);
    }

    $.ajax({
        type: "POST",
        url: '/Calculate/getProducts/BySpecification',
        async: false,
        data: {
            "Specification": currTabSpec,
            "fromDate": fromDate,
            "toDate": toDate,
            "fromCode": fromCode,
            "toCode": toCode,
            "isCalculate": isCalculate
        },
        success: function (data) {
            totalFirstPriceAmount = 0;
            totalLastPriceAmount = 0;
            totalDiscountAmount = 0;
            totalLossAmount = 0;
            totalStockAmount = 0;
            totalStockPriceAmount = 0;

            var DataTable = document.querySelector('#DataTable');
            var tbody = DataTable.querySelector('tbody');
            tbody.parentNode.removeChild(tbody);
            tbody = document.createElement('tbody');
            DataTable.appendChild(tbody);

            for (var i = 0; i < data.length; i++) {
                if (data[i].Progress == "0" || data[i].Progress == "1" || data[i].Progress == "2") {
                    appendNormalProduct(data[i], i);
                } else if (data[i].Progress == "3") {
                    appendSalsedProduct(data[i], i);
                } else if (data[i].Progress == "4") {
                    appendLossProduct(data[i], i);
                }
            }
            if (isCalculate == '1') {
                appendRestStockInfo();
            }
            refreshTotalElements();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

// Refresh DataTable Module - by KeyWord ( using Search ) - Data.Code
function RefreshDataTableByWord(word) {
    var fromYear = document.querySelector('#fromYear').value;
    var fromMonth = document.querySelector('#fromMonth').value;
    if (fromMonth.length == 1)
        fromMonth = '0' + fromMonth;
    var fromDay = document.querySelector('#fromDay').value;
    if (fromDay.length == 1)
        fromDay = '0' + fromDay;

    var toYear = document.querySelector('#toYear').value;
    var toMonth = document.querySelector('#toMonth').value;
    if (toMonth.length == 1)
        toMonth = '0' + toMonth;
    var toDay = document.querySelector('#toDay').value;
    if (toDay.length == 1)
        toDay = '0' + toDay;

    var fromDate = fromYear + fromMonth + fromDay + '000000';
    var toDate = toYear + toMonth + toDay + '235959';
    if (fromDate > toDate) {
        alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
        return;
    }

    var fromCode = document.querySelector('#fromCode').value;
    var toCode = document.querySelector('#toCode').value;

    if (fromCode == '' && toCode == '') {
        fromCode = 'AAA000';
        toCode = 'ZZZ999';
    } else {
        if (fromCode.match(/\w\w\w\d\d\d/) == null) {
            alert('시작코드를 올바르게 입력해주세요');
            return;
        }
        if (toCode.match(/\w\w\w\d\d\d/) == null) {
            alert('끝코드를 올바르게 입력해주세요');
            return;
        }

        if (fromCode == '')
            fromCode = 'AAA000';
        if (toCode == '')
            toCode = 'ZZZ999';
    }

    $.ajax({
        type: "POST",
        url: '/Calculate/getProducts/BySpecification',
        async: false,
        data: {
            "Specification": currTabSpec,
            "fromDate": fromDate,
            "toDate": toDate,
            "fromCode": fromCode,
            "toCode": toCode,
            "isCalculate": isCalculate
        },
        success: function (data) {
            totalFirstPriceAmount = 0;
            totalLastPriceAmount = 0;
            totalDiscountAmount = 0;
            totalLossAmount = 0;
            totalStockAmount = 0;
            totalStockPriceAmount = 0;

            var DataTable = document.querySelector('#DataTable');
            var tbody = DataTable.querySelector('tbody');
            tbody.parentNode.removeChild(tbody);
            tbody = document.createElement('tbody');
            DataTable.appendChild(tbody);

            for (var i = 0; i < data.length; i++) {
                if (data[i].Code.indexOf(word) != -1) {
                    if (data[i].Progress == "0" || data[i].Progress == "1" || data[i].Progress == "2") {
                        appendNormalProduct(data[i], i);
                    } else if (data[i].Progress == "3") {
                        appendSalsedProduct(data[i], i);
                    } else if (data[i].Progress == "4") {
                        appendLossProduct(data[i], i);
                    }
                }
            }
            if (isCalculate == '1') {
                appendRestStockInfo();
            }
            refreshTotalElements();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

document.querySelector('#searchCalculateBtn').addEventListener('click', function () {
    var SearchWord = document.getElementById('DataTableSearch').value;
    if (SearchWord == '') {
        RefreshDataTable();
    } else {
        RefreshDataTableByWord(SearchWord);
    }
});

if (isCalculate == '0') {
    document.querySelector('#submitCalculateBtn').addEventListener('click', function () {
        var fromYear = document.querySelector('#fromYear').value;
        var fromMonth = document.querySelector('#fromMonth').value;
        if (fromMonth.length == 1)
            fromMonth = '0' + fromMonth;
        var fromDay = document.querySelector('#fromDay').value;
        if (fromDay.length == 1)
            fromDay = '0' + fromDay;

        var toYear = document.querySelector('#toYear').value;
        var toMonth = document.querySelector('#toMonth').value;
        if (toMonth.length == 1)
            toMonth = '0' + toMonth;
        var toDay = document.querySelector('#toDay').value;
        if (toDay.length == 1)
            toDay = '0' + toDay;

        var fromDate = fromYear + fromMonth + fromDay;
        var toDate = toYear + toMonth + toDay;
        if (fromDate >= toDate) {
            alert('error : To 날짜를 From 날짜 이후로 설정해 주세요');
            return;
        }

        var season = document.querySelector('#seasonNameH').innerHTML;
        if (confirm(season + ' 완료하시겠습니까?\n(완료시 수정이 불가능 합니다)')) {
            $.ajax({
                type: "POST",
                url: '/Calculate/complete',
                data: {
                    seasonCode: params[0],
                    fromDate: fromDate,
                    toDate: toDate,
                    totalStockAmount: totalStockAmount,
                    totalStockPrice: totalStockPriceAmount
                },
                success: function (data) {
                    window.location.href = window.location.href;
                    alert(data);
                },
                error: function (e) {
                    alert(e.responseText);
                }
            });
        }
    });
}

// 현금흐름표 관련 코드

var refreshCashFlowTotalTable = function () {
    var income = 0; // 양수
    var coss = 0; // 음수
    var netIncome = 0;
    for (var i = 0; i < itemGroupList.length; i++) {
        if (itemGroupList[i] == null) continue;

        var amount = itemGroupList[i].amount
        if (amount > 0) {
            income += amount;
        } else if (amount < 0) {
            coss += amount;
        }
    }
    netIncome = income + coss;

    var Income = document.querySelector('#Income');
    var priceStr = String(income).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    Income.innerHTML = priceStr + '원';
    var Coss = document.querySelector('#Coss');
    var priceStr = String(coss).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    Coss.innerHTML = priceStr + '원';
    var NetIncome = document.querySelector('#NetIncome');
    var priceStr = String(netIncome).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    NetIncome.innerHTML = priceStr + '원';

}

var deleteItemGroupFunc = function (idx) {
    var index = idx;
    return function () {
        if (confirm(itemGroupList[index].name + '- 항목을 삭제하시겠습니까?')) {
            itemGroupList[index] = null;
            refreshItemGroupTable();
            refreshCashFlowTotalTable();
        }
    }
}

var deleteItemFunc = function (idxI, idxJ) {
    var indexI = idxI;
    var indexJ = idxJ;
    return function () {
        if (confirm('비고 : ' + itemGroupList[indexI].itemList[indexJ].Remark + ' - 항목을 삭제하시겠습니까?')) {
            itemGroupList[indexI].amount -= itemGroupList[indexI].itemList[indexJ].Amount;
            itemGroupList[indexI].itemList[indexJ] = null;
            refreshItemGroupTable();
            viewItemGroupDetail(idxI)();
            refreshCashFlowTotalTable();
        }
    }
}

var addItemFunc = function (idx) {
    var index = idx;
    return function () {
        var item = {
            Season: params[0],
            Name: itemGroupList[index].name,
            Amount: 0,
            Remark: ''
        }
        itemGroupList[index].itemList.push(item);
        viewItemGroupDetail(index)();
    }
}

var changeItemGroupNameInfo = function (idx, target_) {
    var index = idx;
    var target = target_;

    return function () {
        var name = target.value;
        if (name.length > 10) {
            alert('error! 항목명은 10자리까지 입력가능합니다');
            target.value = itemGroupList[index].name;
            return;
        }

        var isExist = 0;
        for (var i = 0; i < itemGroupList.length; i++) {
            if (itemGroupList[i] == null) continue;
            if (itemGroupList[i].name == name) {
                isExist = 1;
                break;
            }
        }
        if (isExist == 1) {
            alert('error! 입력한 항목명이 이미 존재합니다.');
            target.value = itemGroupList[index].name;
            return;
        }

        itemGroupList[index].name = name;
        for (var i = 0; i < itemGroupList[index].itemList.length; i++) {
            if (itemGroupList[index].itemList[i] == null) continue;
            itemGroupList[index].itemList[i].Name = name;
        }
        refreshItemGroupTable();
        viewItemGroupDetail(index)();
    }
}

var changeItemAmountInfo = function (idxI, idxJ, target_) {
    var indexI = idxI;
    var indexJ = idxJ;
    var target = target_;
    return function () {
        var amount = '~' + target.value + '~';
        var result = amount.match(/~(-[\d]+)~|~([\d]+)~/);
        if (result == null) {
            alert('error! 금액을 올바르게 입력해주세요');
            target.value = itemGroupList[indexI].itemList[indexJ].Amount;
            return;
        }
        amount = result[0].replace(/[~-]/g, '');
        if (amount.length > 11) {
            alert('error! 금액은 11자리까지 입력가능합니다');
            target.value = itemGroupList[indexI].itemList[indexJ].Amount;
            return;
        }
        amount = result[0].replace(/[~]/g, '');
        itemGroupList[indexI].itemList[indexJ].Amount = Number(amount);
        itemGroupList[indexI].amount += Number(amount);
        refreshItemGroupTable();
        refreshCashFlowTotalTable();
    }
}

var changeItemRemarkInfo = function (idxI, idxJ, target_) {
    var indexI = idxI;
    var indexJ = idxJ;
    var target = target_;
    return function () {
        var remark = target.value;
        if (remark.length > 20) {
            alert('error! 비고는 20자리까지 입력가능합니다');
            remark = remark.substring(0, 20);
            target.value = remark;
            return;
        }
        itemGroupList[indexI].itemList[indexJ].Remark = remark;
        refreshItemGroupTable();
        refreshCashFlowTotalTable();
    }
}

var viewItemGroupDetail = function (idx) {
    var index = idx;
    return function () {
        var itemTable = document.querySelector('#itemTable');
        var tbody = itemTable.querySelector('tbody');
        tbody.parentNode.removeChild(tbody);
        tbody = document.createElement('tbody');
        itemTable.appendChild(tbody);

        var data = itemGroupList[index].itemList;
        var cnt = 0;

        var addItemBtn = document.querySelector('#addItemBtn');
        if (addItemBtn != null) {
            addItemBtn.parentNode.removeChild(addItemBtn);
        }
        if (idx >= 2 && isCalculate == '0') {
            var detailSection = document.querySelector('#detailSection');
            var button = document.createElement('button');
            button.className = 'btn btn-primary float-right mt-0';
            button.id = 'addItemBtn';
            button.innerHTML = '행추가';
            button.addEventListener('click', addItemFunc(index));
            detailSection.appendChild(button);
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i] == null) {
                cnt++;
                continue;
            }

            var tr = document.createElement('tr');
            tr.id = i;

            var td = document.createElement('td');
            td.id = 'no'
            td.innerHTML = i + 1 - cnt;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'name';
            td.innerHTML = data[i].Name;
            tr.appendChild(td);

            var td = document.createElement('td');
            var textbox = document.createElement('input');
            textbox.type = 'text';
            textbox.className = 'text-right';
            textbox.id = 'amount';
            textbox.value = data[i].Amount;
            textbox.addEventListener('change', changeItemAmountInfo(index, i, textbox));
            if (isCalculate == '1') {
                textbox.readOnly = true;
            }
            td.appendChild(textbox);
            tr.appendChild(td);

            var td = document.createElement('td');
            var textbox = document.createElement('input');
            textbox.type = 'text';
            textbox.className = 'text-center';
            textbox.id = 'remark';
            textbox.value = data[i].Remark;
            textbox.addEventListener('change', changeItemRemarkInfo(index, i, textbox));
            if (isCalculate == '1') {
                textbox.readOnly = true;
            }
            td.appendChild(textbox);
            tr.appendChild(td);

            if (isCalculate == '1') {
                var td = document.createElement('td');
                td.id = 'deleteItemGroup';
                td.innerHTML = '-';
                tr.appendChild(td);
            } else {
                var td = document.createElement('td');
                td.style = 'padding: 5px';
                td.id = 'deleteItem';
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn btn-primary';
                btn.addEventListener('click', deleteItemFunc(index, i));
                var iTag = document.createElement('i');
                iTag.className = 'fas fa-window-close';
                btn.appendChild(iTag);
                td.appendChild(btn);
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }
    }
}

var refreshItemGroupTable = function () {
    var itemGroupTable = document.querySelector('#itemGroupTable');
    var tbody = itemGroupTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    itemGroupTable.appendChild(tbody);

    var data = itemGroupList;
    var cnt = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i] == null) {
            cnt++;
            continue;
        }

        var tr = document.createElement('tr');
        tr.id = i;
        tr.addEventListener('click', viewItemGroupDetail(i));

        var td = document.createElement('td');
        td.id = 'no'
        td.innerHTML = i + 1 - cnt;
        tr.appendChild(td);

        if (i <= 1) {
            var td = document.createElement('td');
            td.id = 'name';
            td.innerHTML = data[i].name;
            tr.appendChild(td);
        } else {
            var td = document.createElement('td');
            var textbox = document.createElement('input');
            td.id = 'name';
            textbox.type = 'text';
            textbox.className = 'text-center';
            textbox.id = 'name';
            textbox.value = data[i].Amount;
            textbox.addEventListener('change', changeItemGroupNameInfo(i, textbox));
            textbox.value = data[i].name;
            if (isCalculate == '1') {
                textbox.readOnly = true;
            }
            td.appendChild(textbox);
            tr.appendChild(td);
        }

        var td = document.createElement('td');
        td.className = 'text-right';
        td.id = 'amount';
        var priceStr = String(data[i].amount).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        if (i <= 1 || isCalculate == '1') {
            var td = document.createElement('td');
            td.id = 'deleteItemGroup';
            td.innerHTML = '-';
            tr.appendChild(td);
        } else {
            var td = document.createElement('td');
            td.style = 'padding: 5px';
            td.id = 'deleteItemGroup';
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-primary';
            btn.addEventListener('click', deleteItemGroupFunc(i));
            var iTag = document.createElement('i');
            iTag.className = 'fas fa-window-close';
            btn.appendChild(iTag);
            td.appendChild(btn);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }
}
refreshItemGroupTable();

document.querySelector('#addItemGroupBtn').addEventListener('click', function () {
    var itemGroup = {
        name: '',
        amount: 0,
        itemList: []
    }
    itemGroupList.push(itemGroup);
    refreshItemGroupTable();
});

var getItemGroupList = function () {
    $.ajax({
        type: "POST",
        url: '/Calculate/cashflow/getItemGroupList',
        data: {
            seasonCode: params[0],
        },
        success: function (data) {
            if (data != 'err') {
                for (var i = 0; i < data.length; i++) {
                    itemGroupList.push(data[i]);
                }
                refreshItemGroupTable();
                refreshCashFlowTotalTable();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getItemGroupList();

var updateCashFlowFunc = function () {
    for (var i = 2; i < itemGroupList.length; i++) {
        if (itemGroupList[i] == null) continue;
        if (itemGroupList[i].name == '') {
            alert('항목명이 입력안된 항목이 있습니다\n(항목명은 필수입력값입니다)');
            return;
        }
        if (itemGroupList[i].itemList.length == 0) {
            alert('세부내용이 입력안된 항목이 있습니다\n(적어도 1개 이상의 세부항목을 가져야 합니다)');
            return;
        } else {
            var check = 0; // 세부내용 itemList에 null이아닌 항목이 1개이상 있는지 체크
            for (var j = 2; j < itemGroupList[i].itemList.length; j++) {
                if (itemGroupList[i].itemList[j] != null) {
                    isCheck = 1;
                    break;
                }
            }
            if (check == 1) {
                alert('세부내용이 입력안된 항목이 있습니다\n(적어도 1개 이상의 세부항목을 가져야 합니다)');
                return;
            }
        }
    }

    if (confirm('수정하시겠습니까?')) {
        $.ajax({
            type: "POST",
            url: '/Calculate/cashflow/update',
            data: {
                seasonCode: params[0],
                itemGroupList: itemGroupList
            },
            success: function (data) {
                window.location.href = window.location.href;
                alert(data);
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
document.querySelector('#updateCashFlowBtn').addEventListener('click', updateCashFlowFunc);

if (isCalculate == '1') {
    var addItemGroupBtn = document.querySelector('#addItemGroupBtn')
    addItemGroupBtn.parentNode.removeChild(addItemGroupBtn);
    var updateCashFlowBtn = document.querySelector('#updateCashFlowBtn')
    updateCashFlowBtn.parentNode.removeChild(updateCashFlowBtn);
}
//-현금흐름표 관련 코드
