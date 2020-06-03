// 컬렉션, 비하인드 동적 생성
// 컬랙션
var refreshLookbookList = function (data) {
    for (var i = 0; i < data.length; i++) {
        var ul = document.querySelector('#collection-menu').querySelector('ul');
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = 'LookBook.html?Season=20' + data[i].Season;
        var tmp = '';
        if (data[i].Season[3] == '1') {
            tmp = '20' + data[i].Season.substring(0, 2) + ' Spring';
        } else if (data[i].Season[3] == '2') {
            tmp = '20' + data[i].Season.substring(0, 2) + ' Fall';
        }
        a.innerHTML = tmp;
        li.appendChild(a);
        ul.appendChild(li);
    }
}
var getLookbookList = function () {
    $.ajax({
        type: "POST",
        url: '/Lookbook/getLookbookList/DESC',
        async: false,
        success: function (data) {
            if (data != null) {
                refreshLookbookList(data);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getLookbookList();

// 비하인드컷
var refreshBehindcutList = function (data) {
    for (var i = 0; i < data.length; i++) {
        var ul = document.querySelector('#behindcut-menu').querySelector('ul');
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = 'behindcut.html?Season=20' + data[i].Season;
        var tmp = '';
        if (data[i].Season[3] == '1') {
            tmp = '20' + data[i].Season.substring(0, 2) + ' Spring';
        } else if (data[i].Season[3] == '2') {
            tmp = '20' + data[i].Season.substring(0, 2) + ' Fall';
        }
        a.innerHTML = tmp;
        li.appendChild(a);
        ul.appendChild(li);
    }
}
var getBehindCutList = function () {
    $.ajax({
        type: "POST",
        url: '/BehindCut/getBehindCutList/DESC',
        async: false,
        success: function (data) {
            if (data != null) {
                refreshBehindcutList(data);
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
getBehindCutList();


var filter = "win16|win32|win64|mac|macintel";
if (navigator.platform) {
    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) { //mobile
        var aFlag = 0;
        var cFlag = 0;
        var bFlag = 0;

        var about = document.querySelector('#about-menu');
        var collection = document.querySelector('#collection-menu');
        var behindcut = document.querySelector('#behindcut-menu');

        var undisplayAllMenu = function () {
            var ul = about.querySelector('ul');
            ul.style.display = 'none';
            aFlag = 0;
            var ul = collection.querySelector('ul');
            ul.style.display = 'none';
            cFlag = 0;
            var ul = behindcut.querySelector('ul');
            ul.style.display = 'none';
            bFlag = 0;
        }

        about.addEventListener('click', function (e) {
            if (aFlag == 0) { // 클릭된 상태가 아니라면 이후 이벤트 막음 (body, aside 이벤트 막음)
                e.stopPropagation();
            }
            undisplayAllMenu();
            var ul = about.querySelector('ul');
            ul.style.display = 'block';
            aFlag = 1;
        });

        collection.addEventListener('click', function (e) {
            if (cFlag == 0) {
                e.stopPropagation();
            }	    
            undisplayAllMenu();
            var ul = collection.querySelector('ul');
            ul.style.display = 'block';
            cFlag = 1;
        });

        behindcut.addEventListener('click', function (e) {
            if (bFlag == 0) {
                e.stopPropagation();
            }
            undisplayAllMenu();
            var ul = behindcut.querySelector('ul');
            ul.style.display = 'block';
            bFlag = 1;
        });

        var body = document.querySelector('body');
        body.addEventListener('click', undisplayAllMenu);
        var aside = document.querySelector('fh5co-aside');
        aside.addEventListener('click', undisplayAllMenu);
    } else { //pc
    }
}
