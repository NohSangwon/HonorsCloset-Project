function excelExport(event) {
    var sheetNum = 0;
    excelExportCommon(event, sheetNum, handleExcelDataAll);
}

function excelExportCommon(event, sheetNum, callback) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {
            type: 'binary'
        });
        var sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기 
        var firstSheetName = sheetNameList[sheetNum]; // 첫번째 시트명
        var firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트 
        callback(firstSheetName, firstSheet);
    };
    reader.readAsBinaryString(input.files[0]);
}

function get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({
            c: C,
            r: R
        })] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(decodeURI(hdr));
    }
    return headers;
}

var currData = new Object();
currData.sheetName = null;
currData.labels = null;
currData.datas = null;

function handleExcelDataAll(sheetName, sheet) {
    currData.sheetName = sheetName;
    currData.labels = get_header_row(sheet);
    currData.datas = XLSX.utils.sheet_to_json(sheet);
    refreshXlsxProductTable();
}

var refreshXlsxProductTable = function () {
    var xlsxProductTable = document.querySelector('#xlsxProductTable');
    var tbody = xlsxProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    xlsxProductTable.appendChild(tbody);

    var data = currData.datas;
    document.querySelector('#totalData').innerHTML = data.length;
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = String(data[i][currData.labels[0]]) + String(i);

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = i + 1;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Code';
        td.innerHTML = data[i][currData.labels[0]];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'FirstPrice';
        td.innerHTML = data[i][currData.labels[1]] + ' 원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'RegistDate';
        td.innerHTML = data[i][currData.labels[2]];
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

var setResultOnXlsxProductTable = function (data) {
    for (var i = 0; i < data.length; i++) {
        var tr = document.querySelector('#' + String(data[i].targetId));
        if (data[i].result == 'success')
            tr.style = "background-color: blue";
        else
            tr.style = "background-color: red";
    }
}

var submitXlsxFunc = function () {
    $.ajax({
        type: "POST",
        url: '/addProduct/xlsx',
        async: false,
        data: currData,
        success: function (data) {
            setResultOnXlsxProductTable(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

var submitBtn = document.querySelector('#submitBtn');
submitBtn.addEventListener('click', submitXlsxFunc);
