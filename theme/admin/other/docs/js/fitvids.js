!function ($) {

    $(function() {

        $(".vid-wrapper").fitVids();
        // Custom selector and No-Double-Wrapping Prevention Test
        $(".vid-wrapper").fitVids({ customSelector: "iframe[src^='http://socialcam.com']"});

    });
}(window.jQuery);