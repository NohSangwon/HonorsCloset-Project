var OrderTable = function (data) {
    var saleProductTable = document.querySelector('#OrderTable');
    var tbody = saleProductTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    saleProductTable.appendChild(tbody);
    
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.id = 'No';
        td.innerHTML = data[i].No;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Thumbnail';
        var img = document.createElement('img');
        img.src = data[i].Thumbnail;
        img.style.maxWidth = '70%';
        img.style.height = 'auto';
        td.appendChild(img);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.id = 'Product_Code';
        td.innerHTML = data[i].Product_Code + "<br><br>" + comma(data[i].Price) + "원";
        tr.appendChild(td);
        
        var td = document.createElement('td');
        td.id = 'OrderDate';
        td.innerHTML = data[i].OrderDate;  
        tr.appendChild(td);
        
        var td = document.createElement('td');
        td.id = 'CancelDate';
        td.innerHTML = data[i].CancelDate;  
        tr.appendChild(td);
        
       var td = document.createElement('td');
        td.id = 'OrderState';
        if(data[i].CancelDate!='-'){
            td.innerHTML = "취소완료";
        }
        else if(data[i].SaleDate){
            td.innerHTML = "구매완료";
        }
        else {
            td.innerHTML = "입금대기";
        }  
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}




var getOrderCheck = function () {
    $.ajax({
        type: "POST",
        url: '/getOrderCheck/order',
        success: function (data) {
            OrderTable(data);
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
getOrderCheck();
