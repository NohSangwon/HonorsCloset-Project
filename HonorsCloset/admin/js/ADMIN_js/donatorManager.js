var getDonatorList = function () {
    $.ajax({
        type: "POST",
        url: '/Setting/getDonatorList',
        success: function (data) {
            if (data == 'err') {
                alert('err');
            } else {
                document.querySelector('#TinymceDonator').value = data;
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getDonatorList();

var updateDonatorListFunc = function () {
    var donatorList = tinymce.activeEditor.getContent();
    $.ajax({
        type: "POST",
        url: '/Setting/updateDonatorList',
        data: {
            donatorList: donatorList
        },
        success: function (data) {
            if (data == 'err') {
                alert('err');
            } else {
                alert('안내문구 변경완료');
                location.reload(true);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
document.querySelector('#updateDonatorListBtn').addEventListener('click', updateDonatorListFunc);