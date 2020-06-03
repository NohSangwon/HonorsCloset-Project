$.ajax({
    type: "POST",
    url: '/Login/checkIsManager',
    async: false,
    success: function (data) {
        if (data == '0') {
            alert('접근권한이 없습니다.')
            window.location.href = '../login.html';
        }
    },
    error: function (e) {
        alert(e.responseText);
    }
});
