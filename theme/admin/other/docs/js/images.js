!function ($) {

    $(function() {

        /* popup gallery
         ---------------------------------------------------------- */
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                }
            },
            retina: {
                ratio: 1, // Increase this number to enable retina image support.
                // Image in popup will be scaled down by this number.
                // Option can also be a function which should return a number (in case you support multiple ratios). For example:
                // ratio: function() { return window.devicePixelRatio === 1.5 ? 1.5 : 2  }


                replaceSrc: function(item, ratio) {
                    return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
                } // function that changes image source
            }
        });

    });
}(window.jQuery);