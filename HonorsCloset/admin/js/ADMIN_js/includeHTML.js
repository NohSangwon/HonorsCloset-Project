var includeTarget = function (target) {
    var elmnt = target;
    var file = elmnt.getAttribute("include-html");
    if (file) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                elmnt.innerHTML = this.responseText;
                elmnt.removeAttribute("include-html");
            }
        }
        xhttp.open("GET", file, false);
        xhttp.send();
    }
}

var includeHTML = function () {
    var targets = document.querySelectorAll('#includeHTML');
    for (var i = 0; i < targets.length; i++) {
        includeTarget(targets.item(i));
    }
}