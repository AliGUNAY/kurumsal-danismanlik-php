!function ($) {

    $(function() {

        $('.slimScroller').each(function () {
            $(this).slimScroll({
                size: '7px',
                color: '#a1b2bd',
                railColor: '#ccc',
                //position: isRTL ? 'left' : 'right',
                height: $(this).css('height'),
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: false
            });
        });

    });
}(window.jQuery);