String.prototype.format = function (args) {
    var result = this;
    if (arguments.length <= 0) return result;
    if (arguments.length == 1 && typeof (args) == "object") {
        for (var key in args) {
            if (args[key] != undefined) {
                result = result.replace(
                    new RegExp("({" + key + "})", "g"),
                    args[key]
                );
            }
        }
    } else {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] != undefined) {
                result = result.replace(
                    new RegExp("({)" + i + "(})", "g"),
                    arguments[i]
                );
            }
        }
    }
    return result;
};

String.prototype.strip = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

Array.prototype.contains = function (item) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == item) {
            return true;
        }
    }
    return false;
};

// configure toastr
$(document).ready(function () {
    toastr.options.escapeHtml = true;
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    toastr.options.extendedTimeOut = 60;
    toastr.options.timeOut = 800;

    toastr.options.showMethod = 'slideDown';
    toastr.options.hideMethod = 'slideUp';
});


$(".category .dropdown").dropdown({
    action: "hide"
});
$('.top-header .dropdown').dropdown();
$('.ui.accordion').accordion();
$('.ui.checkbox').checkbox();
$('.ui.embed').embed();

// messages
$('.message .close').click(function () {
    var message = $(this).closest('.message');
    message.transition('fade');
    setTimeout(function () {
        message.remove();
    }, 300);
});


$(".menus.dropdown").dropdown({
    action: "hide"
});

$(document).ready(function () {
    var mathjax_url = 'https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
    $.getScript(mathjax_url, function (script, textStatus, jqXHR) {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [
                    ['$', '$'],
                    ['\\(', '\\)']
                ],
                displayMath: [
                    ['$$', '$$'],
                    ["\\[", "\\]"]
                ]
            },
            TeX: {
                extensions: ["AMSmath.js", "AMSsymbols.js", "extpfeil.js", "autoload-all.js"]
            },
            "HTML-CSS": {
                preferredFont: "STIX"
            }
        });
    });
});
