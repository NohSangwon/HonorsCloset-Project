var saleProducts;
var currentTabTableId = 'saleAProductTable';
// 판매물품 목록에서 삭제
var removeBasket = function () {
    var basketTable = document.querySelector('#basketTable');
    // IE에선 remove() 안먹힘
    var tbody = basketTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    basketTable.appendChild(tbody);
    var amount = document.querySelector('#totalAmount');
    amount.innerHTML = 0;
}
var deleteBasket = function (pCode) {
    const p_code = pCode;

    return function () {
        var tr = document.querySelector('#basketTable').querySelector('#' + p_code);
        var amount = document.querySelector('#totalAmount');
        var lastPrice = tr.querySelector('#LastPrice').innerHTML.replace(/[,원]/g, '');
        var amountTmp = amount.innerHTML.replace(/,/g, '');
        var amountStr = String(Number(amountTmp) - Number(lastPrice)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        amount.innerHTML = amountStr;
        tr.parentNode.removeChild(tr);
    }
}

// 판매물품 목록에 등록
var addBasket = function (pCode, targetTableId) {
    const p_code = pCode;

    return function () {
        var tbody = document.querySelector('#basketTable').querySelector('tbody');


        var trList = tbody.querySelectorAll('tr');
        var isExist = 0;

        for (var i = 0; i < trList.length; i++) {
            var code = trList.item(i).querySelector('#Code').innerHTML;
            if (code == p_code) {
                isExist = 1;
                break;
            }
        }
        if (isExist == 1) {
            alert('이미 판매목록에 추가된 상품입니다 : ' + p_code);
        } else {
            var trData = document.querySelector('#' + targetTableId).querySelector('#' + p_code);

            var basketTbody = document.querySelector('#basketTable').querySelector('tbody');
            var tr = document.createElement('tr');
            tr.id = p_code;

            var td = document.createElement('td');
            var a = document.createElement('a');
            a.id = 'Code';
            a.innerHTML = trData.querySelector('#Code').innerHTML;
            a.addEventListener('mouseover', OverThumbnailEvent);
            a.addEventListener('mouseout', OverThumbnailOutEvent);
            td.appendChild(a);
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'RegistDate';
            td.innerHTML = trData.querySelector('#RegistDate').innerHTML;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.className = 'text-right';
            td.id = 'FirstPrice';
            td.innerHTML = trData.querySelector('#FirstPrice').innerHTML;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'DiscountRate';
            td.innerHTML = trData.querySelector('#DiscountRate').innerHTML;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.className = 'text-right';
            td.id = 'DiscountAmount';
            td.innerHTML = trData.querySelector('#DiscountAmount').innerHTML;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.className = 'text-right';
            td.id = 'LastPrice';
            td.innerHTML = trData.querySelector('#LastPrice').innerHTML;
            tr.appendChild(td);

            var td = document.createElement('td');
            td.id = 'deleteBasketBtn';
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-primary';
            btn.addEventListener('click', deleteBasket(p_code));
            var iTag = document.createElement('i');
            iTag.className = 'fas fa-window-close';
            btn.appendChild(iTag);
            td.appendChild(btn);
            tr.appendChild(td);

            basketTbody.appendChild(tr);

            var amount = document.querySelector('#totalAmount');
            var lastPrice = tr.querySelector('#LastPrice').innerHTML.replace(/[,원]/g, '');
            var amountTmp = amount.innerHTML.replace(/[,]/g, '');
            var amountStr = String(Number(amountTmp) + Number(lastPrice)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            amount.innerHTML = amountStr;
        }
    }
}

var refreshSaleProductTable = function (data, targetTableId) {

    var saleProductTable = document.querySelector('#' + targetTableId);
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i].Code;

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
        var registDate = data[i].RegistDate;
        registDate = registDate.substring(0, 4) + '/' + registDate.substring(4, 6) + '/' + registDate.substring(6, 8);
        td.innerHTML = registDate;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.className = 'text-right';
        td.id = 'FirstPrice';
        var priceStr = String(data[i].FirstPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'DiscountRate';
        td.innerHTML = Number(data[i].DiscountRate) * 100 + '%';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.className = 'text-right';
        td.id = 'DiscountAmount';
        var tmp = Number(data[i].FirstPrice) - Number(data[i].LastPrice);
        var priceStr = String(tmp).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.className = 'text-right';
        td.id = 'LastPrice';
        var priceStr = String(data[i].LastPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        td.innerHTML = priceStr + '원';
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'addBasketBtn';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary';
        btn.addEventListener('click', addBasket(data[i].Code, targetTableId));
        var iTag = document.createElement('i');
        iTag.className = 'fas fa-cart-plus';
        btn.appendChild(iTag);
        td.appendChild(btn);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

var getProductsSaleAll = function () {
    currentTabTableId = 'saleAProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/all',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleT = function () {
    currentTabTableId = 'saleTProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/t',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleB = function () {
    currentTabTableId = 'saleBProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/b',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleS = function () {
    currentTabTableId = 'saleSProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/s',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleO = function () {
    currentTabTableId = 'saleOProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/o',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleG = function () {
    currentTabTableId = 'saleGProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/g',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
var getProductsSaleE = function () {
    currentTabTableId = 'saleEProductTable';
    $.ajax({
        type: "GET",
        url: '/getProducts/sale/e',
        success: function (data) {
            saleProducts = data;
            var keyword = document.querySelector('#searchProductKeyword').value;
            if (keyword == '') {
                refreshSaleProductTable(saleProducts, currentTabTableId);
            } else {
                searchProductKeywordFunc();
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getProductsSaleAll();
document.querySelector('#tab_A').addEventListener('click', getProductsSaleAll);
document.querySelector('#tab_T').addEventListener('click', getProductsSaleT);
document.querySelector('#tab_B').addEventListener('click', getProductsSaleB);
document.querySelector('#tab_S').addEventListener('click', getProductsSaleS);
document.querySelector('#tab_O').addEventListener('click', getProductsSaleO);
document.querySelector('#tab_G').addEventListener('click', getProductsSaleG);
document.querySelector('#tab_E').addEventListener('click', getProductsSaleE);

var getBasketJson = function () {
    var trList = document.querySelector('#basketTable').querySelector('tbody').querySelectorAll('tr');
    var basketJson = new Object();

    basketJson.amount = document.querySelector('#totalAmount').innerHTML.replace(/[,원]/g, '');
    basketJson.seller = '임시판매자';
    basketJson.products = [];

    for (var i = 0; i < trList.length; i++) {
        var product = new Object();
        product.Code = trList.item(i).querySelector('#Code').innerHTML;
        var lastPrice = trList.item(i).querySelector('#LastPrice').innerHTML.replace(/[,원]/g, '');
        product.LastPrice = lastPrice;
        basketJson.products.push(product);
    }
    return basketJson;
}

var salesCashPayFunc = function () {
    var basket = getBasketJson();
    if (basket.products.length == 0) {
        alert('등록된 상품이 없습니다.');
        return 0;
    }
    
    if (! confirm('현금 판매 등록하시겠습니까?')) return;
    if (isOnSaleFunc(basket) == 0) return;

    $.ajax({
        type: 'POST',
        url: '/sales/cashPay',
        data: basket,
        success: function (data) {
            window.location.href = window.location.href;
            alert(data);
        },
        error: function (xhr, status, error) {
            alert(e.responseText);
        },
        dataType: 'json'
    });
}

var salesAccountPayFunc = function () {
    var basket = getBasketJson();
    if (basket.products.length == 0) {
        alert('등록된 상품이 없습니다.');
        return 0;
    }
    
    if (! confirm('계좌이체 판매 등록하시겠습니까?')) return;
    if (isOnSaleFunc(basket) == 0) return;
    
    $.ajax({
        type: 'POST',
        url: '/sales/accountPay',
        data: basket,
        success: function (data) {
            window.location.href = window.location.href;
            alert(data);
        },
        error: function (xhr, status, error) {
            alert(e.responseText);
        },
        dataType: 'json'
    });
}

var searchProductKeywordFunc = function () {
    var keyword = document.querySelector('#searchProductKeyword').value;
    var targetProducts = [];
    for (var i = 0; i < saleProducts.length; i++) {
        if (!(saleProducts[i].Code.indexOf(keyword) == -1)) {
            targetProducts.push(saleProducts[i]);
        }
    }
    refreshSaleProductTable(targetProducts, currentTabTableId);
}

var refreshSaleTable = function () {
    if (currentTabTableId == 'saleAProductTable') getProductsSaleAll();
    else if (currentTabTableId == 'saleTProductTable') getProductsSaleT();
    else if (currentTabTableId == 'saleBProductTable') getProductsSaleB();
    else if (currentTabTableId == 'saleSProductTable') getProductsSaleS();
    else if (currentTabTableId == 'saleOProductTable') getProductsSaleO();
    else if (currentTabTableId == 'saleGProductTable') getProductsSaleG();
    else if (currentTabTableId == 'saleEProductTable') getProductsSaleE();
}

var isOnSaleFunc = function (basket) {
    var isOnSale = 1;
    $.ajax({
        type: 'POST',
        url: '/sales/checkIsOnSale',
        data: basket,
        async: false,
        dataType: 'json',
        success: function (data) {
            if (Number(data.isOnSale) == 0) {
                isOnSale = 0;
                var msg = '판매에 실패했습니다 : \n';
                for (var i = 0; i < data.info.length; i++) {
                    msg += '(' + data.info[i].Code + ' : ' + data.info[i].msg + ')\n';
                    if (Number(data.info[i].isOnSale) == 0)
                        document.querySelector('#basketTable').querySelector('#' + data.info[i].Code).style = "background: red;";
                }
                var keyword = document.querySelector('#searchProductKeyword').value;
                refreshSaleTable();
                alert(msg);
            }
        },
        error: function (xhr, status, error) {
            alert(e.responseText);
        }
    });
    return isOnSale;
}

var removeBasketBtn = document.querySelector('#removeBasketBtn');
removeBasketBtn.addEventListener('click', removeBasket);
var salesCashPayBtn = document.querySelector('#salesCashPayBtn');
salesCashPayBtn.addEventListener('click', salesCashPayFunc);
var salesAccountPayBtn = document.querySelector('#salesAccountPayBtn');
salesAccountPayBtn.addEventListener('click', salesAccountPayFunc);

var searchProductKeyword = document.querySelector('#searchProductKeyword');
searchProductKeyword.addEventListener('change', refreshSaleTable);


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
