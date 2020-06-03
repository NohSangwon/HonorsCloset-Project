var BoardTable = document.getElementById('BoardTable');
var URL_No = window.location.href.split('?');
var No = URL_No[1].split('=')[1];
var DATA = {
    "No" : No
}

$.ajax({
    type: "POST",
    url: '/getBoard/Review/getReviewByNo',
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

    var Hidden = document.getElementById('Hidden');
    if(data.isHidden == '1'){
        Hidden.innerHTML = 'O';
    }
    else{
        Hidden.innerHTML = 'X';
    }

    var Contents = document.getElementById('Contents');
    Contents.innerHTML = data.Contents;
}

// Hidden Button 이벤트
var Hidden_Button = document.getElementById('Hidden_Button');
Hidden_Button.addEventListener('click',function(){
    Hidden = document.getElementById('Hidden').innerHTML;
    var HiddenDATA = { 'No': No , 'isHidden' : '' };

    if(Hidden == 'O'){ // 비밀글이면 -> 0으로 변경
        HiddenDATA['isHidden'] = '0';
    }
    else{
        HiddenDATA['isHidden'] = '1';
    }

    $.ajax({
        type: "POST",
        url: '/updateBoard/ReviewHidden',
        data: HiddenDATA,
        dataType: 'json',
        async: 'false',
        success: function (data) {
            alert('비밀글 설정이 변경되었습니다.');
        },
        error: function (e) {
            alert(e.responseText);
        }
    });

    var DATA = {'No':No};

    $.ajax({
        type: "POST",
        url: '/getBoard/Review/getReviewByNo',
        data: DATA,
        dataType: 'json',
        async: 'false',
        success: function (data) {
            appendBoard(data[0]);
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