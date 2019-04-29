$(document).ready(function () {
    $.each($('.ui.jplayer.audio'), function (index, audio) {
        var format = 'mp3';

        var player = $(audio);

        var url = player.attr('data-url');

        format = player.attr('format');
        if (!format) {
            format = url.substring(url.lastIndexOf(".") + 1, url.length);
        }

        var ancestor = player.attr('ancestor');

        player.jPlayer({
            cssSelectorAncestor: ancestor,
            ready: function () {
                var data = {};
                data[format] = url;
                $(this).jPlayer("setMedia", data);
            },
            supplied: format,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
        });
    });

    $.each($('.ui.jplayer.video'), function (index, video) {
        var format = 'webmv';

        var player = $(video);

        var url = player.attr('data-url');

        format = player.attr('format');
        if (!format) {
            format = url.substring(url.lastIndexOf(".") + 1, url.length);
        }

        var ancestor = player.attr('ancestor');
        var placeholder = player.attr('data-placeholder');

        $(ancestor).find('.jp-jplayer').jPlayer({
            cssSelectorAncestor: ancestor,
            ready: function () {
                var data = {};
                data[format] = url;
                data.poster = placeholder;
                $(this).jPlayer("setMedia", data);
            },
            supplied: format,
            swfPath: "/js",
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            size: {
                width: $(".main-content").width(),
                height: $(".main-content").width() / 1.77
            }
        });

        $(ancestor).dblclick(function () {
            var player = $(ancestor).find('.jp-jplayer').data().jPlayer;
            if (player.options.fullScreen) {
                $(ancestor).find('.jp-jplayer').jPlayer({
                    fullScreen: false
                });
            } else {
                $(ancestor).find('.jp-jplayer').jPlayer({
                    fullScreen: true
                });
            }
        });
    });
});

$(window).resize(function () {
    $.each($('.ui.jplayer.video'), function (index, video) {
        var player = $(video);
        var ancestor = player.attr('ancestor');
        $(ancestor).find('.jp-jplayer').jPlayer({
            size: {
                width: $(".main-content").width(),
                height: $(".main-content").width() / 1.77
            }
        });
    });
});