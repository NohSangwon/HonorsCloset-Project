function openModal(code_) {
    var code = code_;
    return function () {
        $('#' + code).modal('show');
        $('body').addClass('modal-open');
        $('#sidebar').hide();
    }
}

function closeModal(code) {
    $(code).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#sidebar').show();
}

var submitFunc = function (code_, lastPrice_) {
    var code = code_;
    var lastPrice = lastPrice_;
    return function () {

        $.ajax({
            type: "POST",
            url: '/ProductCLIENT/buycomplete',
            data: {
                code: code,
                lastPrice: lastPrice
            },
            success: function (data) {
                if (data == 'err') {
                    alert("로그인 후에 이용가능합니다!");
                } else if (data == 'success') {
                    alert('구매에 성공하였습니다!');
                    window.location.href = 'buycomplete.html';
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}
var submitFunc2 = function (code_) {
    var code = code_;
    return function () {

        $.ajax({
            type: "POST",
            url: '/ProductCLIENT/basketcomplete',
            data: {
                code: code
            },
            success: function (data) {
                if (data == 'err1') {
                    alert("이미 장바구니에 등록된 상품입니다!");
                } else if (data == 'err2') {
                    alert("로그인 후에 이용가능합니다!");
                } else if (data == 'success') {
                    alert('장바구니에 등록하였습니다!');
                    window.location.href = 'myproduct.html';
                }
            },
            error: function (e) {
                alert(e.responseText);
            }
        });
    }
}

var interestTable = function (data) {
    var saleProductTable = document.querySelector('#interestTable');
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);
    
    for (var i = 0; i < data.length; i++) {
        var tmp = '<a id="aTag' + data[i].Product_Code + '" data-toggle="modal" data-backdrop="static" data-keyboard="false" href="#' + data[i].Product_Code + '"></a>';
        $("tbody").append(tmp);
        var a = document.querySelector("#aTag" + data[i].Product_Code);

        var tr = document.createElement('tr');
        a.appendChild(tr);

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = i+1;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Thumbnail';
        var img = document.createElement('img');
        img.src = data[i].Thumbnail;
        img.style.maxWidth = '70%';
        img.style.height = 'auto';
	img.style.cursor = 'pointer';
        td.appendChild(img);
        tr.appendChild(td);
        img.addEventListener('click', openModal(data[i].Product_Code));


        var td = document.createElement('td');
        td.id = 'Product_Code';
        td.innerHTML = data[i].Product_Code + "<br><br>" + comma(data[i].LastPrice) +  "원";
        tr.appendChild(td);
        
        var td = document.createElement('td');
        td.id = 'Info';
        td.innerHTML = data[i].Info;  
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'DelBtn';
        td.innerHTML = '<a id="DeleteInterest' + data[i].Product_Code + '" style="cursor:pointer; text-decoration:none; font-size:30px"><i class="icon-remove"></i></a>';
        tr.appendChild(td);

        tbody.appendChild(tr);

        document.querySelector('#DeleteInterest' + data[i].Product_Code).addEventListener('click', DeleteInterest(data[i].Product_Code));
        
        var go = "";

        go += '<div class="modal fade" id="';
        go += data[i].Product_Code;
        go += '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> <div class="modal-content" style="max-width: 1300px; margin: 0 auto; margin-top:3%; margin-bottom:3%">  <div class="modal-body"><span><a class="close" onclick="closeModal(' + data[i].Product_Code + ');" style="color:black; z-index:0">x</a></span> <main class="mt-5 pt-4"> <div class="container dark-grey-text mt-5"> <div class="row wow fadeIn"><div class="col-md-6 mb-4"> <img src="'
        go += data[i].Thumbnail;
        go += '" class="img-fluid" alt=""> </div><div class="col-md-6 mb-4"><div class="p-4"><p class="lead"><span class="mr-1">';
        go += comma(data[i].LastPrice);
        go += '원</span></p><br><p>';
        go += data[i].Info;
        go += '</p><form id = "submit_product" class="d-flex justify-content-left"><button class="btn btn-primary btn-md my-0 p" type="button" id="buybutton' + data[i].Product_Code + '">Buy Now <i class="fas fa-shopping-cart ml-1"></i></button>&nbsp;&nbsp;<button class="btn btn-primary btn-md my-0 p" type="button" id="cartbutton' + data[i].Product_Code + '">Add to cart <i class="fas fa-shopping-cart ml-1"></i></button></form></div></div></div><hr><div class="row wow fadeIn"><div class="col-lg-4 col-md-6 mb-4"><img src="'
        go += data[i].Image1;
        go += '"class="img-fluid" alt=""></div><div class="col-lg-4 col-md-6 mb-4"><img src="';
        go += data[i].Image2;
        go += '"class="img-fluid" alt=""></div><div class="col-lg-4 col-md-6 mb-4"><img src="';
        go += data[i].Image3;
        go += '"class="img-fluid" alt=""></div></div></div></main></div></div></div>'

        $("#buypage").append(go);

        document.querySelector('#buybutton' + data[i].Product_Code).addEventListener('click', submitFunc(data[i].Product_Code, data[i].LastPrice));
        document.querySelector('#cartbutton' + data[i].Product_Code).addEventListener('click', submitFunc2(data[i].Product_Code));
    }
}




var getInterest= function () {
    $.ajax({
        type: "POST",
        url: '/getInterest/interest',
        success: function (data) {
            interestTable(data);
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

function comma(num){
    var len, point, str; 
       
    num = num + ""; 
    point = num.length % 3 ;
    len = num.length; 
   
    str = num.substring(0, point); 
    while (point < len) { 
        if (str != "") str += ","; 
        str += num.substring(point, point + 3); 
        point += 3; 
    } 
     
    return str;
 
}

var DeleteInterest = function (code) {
    var code_ = code;

    return function () {
        var del;
        del = confirm("해당 상품을 정말 삭제하시겠습니까?");
        if (del) {
            $.ajax({
                type: "POST",
                url: '/ProductCLIENT/DeleteInterest',
                data: {
                    code: code
                },
                success: function (data) {
                    if (data == 'success') {
                        alert("삭제되었습니다!");
                        window.location.href = 'myproduct.html';
                    }
                },
                error: function (e) {
                    alert(e.responseText);
                }
            });
        }
    }
}

getInterest();
