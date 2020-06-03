var BoardTable = document.getElementById('BoardTable');
var URL_No = window.location.href.split('?');
var No = URL_No[1].split('=')[1];
var DATA = {
    "No" : No
}


$.ajax({
    type: "POST",
    url: '/getBoard/FAQ/getFAQByNo',
    data: DATA,
    dataType: 'json',
    success: function (data) {
        appendBoard(data[0]);
    },
    error: function (e) {
        alert(e.responseText);
    }
});

function appendBoard(data){
    var BoardTable = document.getElementById('BoardTable');
    var tbody = BoardTable.querySelector('tbody');
    tbody.parentNode.removeChild(tbody);

    var Writer = document.getElementById('Writer');
    Writer.innerHTML = data.Writer;

    var Title = document.getElementById('Title');
    Title.innerHTML = data.Title;

    var Specification = document.getElementById('Specification');
    var ConvertedSpecification = data.Specification;
    if(ConvertedSpecification == '0'){
        Specification.innerHTML = '공지사항';
    }
    else if(ConvertedSpecification == '1'){
        Specification.innerHTML = 'FAQ';       
    }
    else if(ConvertedSpecification == '2'){
        Specification.innerHTML = '리뷰';  
    }
    else{
        Specification.innerHTML = 'Error';
    }

    var RegistDate = document.getElementById('Date');
    RegistDate.innerHTML = DateParse(data.Date);

    var Hit = document.getElementById('Hit');
    Hit.innerHTML = data.Hit;

    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = "Contents";
    td.innerHTML = data.Contents;
    td.setAttribute('colspan','2');
    tr.appendChild(td);
    tbody.appendChild(tr);

    BoardTable.appendChild(tbody);
}

// Update Button 이벤트
var Update_Button = document.getElementById('Update_Button');
Update_Button.addEventListener('click',function(){
    window.location.href="BoardUpdate?" + "No=" + No + "&Specification=" + "1";
})

// Delete Button 이벤트
var Delete_Button = document.getElementById('Delete_Button');
Delete_Button.addEventListener('click',function(){

    var URL_No = window.location.href.split('?');
    var No = URL_No[1].split('=')[1];
    var DATA = {
        "No" : No
    }

    $.ajax({
        type: "POST",
        url: '/deleteBoard/deleteFAQ',
        data: DATA,
        dataType: 'json',
        success: function (data) {
            alert('삭제되었습니다.');
            history.back();
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
})

// Back Button 이벤트
var Back_Button = document.getElementById('Back_Button');
Back_Button.addEventListener('click',function(){
    history.back();
})

//============ InterFace ===============
function DateParse(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);
    var h = str.substr(8, 2);
    var mi = str.substr(10, 2);
    
    return (y + '-' + m + '-' + d + ' ' + h + ':' + mi)
}