document.querySelector('#saleProductStaticsTable');

var refreshSaleProductTable = function (data, targetTableId) {
    var targetTable = document.querySelector('#' + targetTableId);
    var tbody = targetTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    targetTable.appendChild(tbody);

    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].Code;

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = i + 1;
        tr.appendChild(td);

        var td = document.createElement('td');
        var a = document.createElement('a');
        a.id = 'Code';
        a.innerHTML = data[i].Code;
        a.addEventListener('mouseover', OverThumbnailEvent);
        a.addEventListener('mouseout', OverThumbnailOutEvent);
        td.appendChild(a);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'RegistDate';
        td.innerHTML = data[i].RegistDate;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'FirstPrice';
        td.innerHTML = data[i].FirstPrice;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'DiscountRate';
        td.innerHTML = Number(data[i].DiscountRate) * 100 + '%';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'LastPrice';
        td.innerHTML = data[i].LastPrice;
        tr.appendChild(td);

        var Progress = data[i].Progress;
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
        var td = document.createElement('td');
        td.id = 'Progress';
        td.innerHTML = Convert_Progress;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Hit';
        td.innerHTML = data[i].Hit;
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

var getProductsHit10 = function () {
    $.ajax({
        type: "GET",
        url: '/getProducts/Hit/10',
        success: function (data) {
            refreshSaleProductTable(data, 'saleProductStaticsTable');
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

getProductsHit10();


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