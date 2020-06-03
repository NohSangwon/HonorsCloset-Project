var imgVersion = Math.floor(Math.random() * 2);
var body = document.querySelector('body');

var refreshMaincut = function () {
    if (imgVersion == 0) {
        body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
    } else {
        body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
    }
    if (window.matchMedia("only screen and (max-height: 568px) and (max-width: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-height: 568px) and (max-height: 640px) and (max-width: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-height: 640px) and (max-height: 736px) and (max-width: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-height: 736px) and (max-height: 823px) and (max-width: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-height: 823px) and (max-height: 1024px) and (max-width: 768px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-height: 1024) and (max-height: 1366px) and (max-width: 1024px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_man.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut_m_woman.jpg)';
        }
    }
    if (window.matchMedia("only screen and (max-height: 450px) and (max-width: 568px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-width: 568px) and (max-width: 640px) and (max-height: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-width: 640px) and (max-width: 736px) and (max-height: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-width: 736px) and (max-width: 823px) and (max-height: 450px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-width: 823px) and (max-width: 1024px) and (max-height: 768px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
    if (window.matchMedia("only screen and (min-width: 1024) and (max-width: 1366px) and (max-height: 1024px)").matches) {
        if (imgVersion == 0) {
            body.style.backgroundImage = 'url(/src/maincut/maincut.jpg)';
        } else {
            body.style.backgroundImage = 'url(/src/maincut/maincut2.jpg)';
        }
    }
}
refreshMaincut();
window.onresize = function () {
    refreshMaincut();
}
