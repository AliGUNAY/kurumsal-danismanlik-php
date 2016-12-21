/* USED FOR DOCS ONLY */
/* USED FOR DOCS ONLY */
/* USED FOR DOCS ONLY */

var $antagonMainColor = "#eba063";

/* etoile */
var etoile = function($target, $multiplier, $class){
    var $delay = Math.floor((Math.random() * $multiplier) + 10);
    $target.toggleClass($class).delay($delay);
    $target.promise().done(function(){
        etoile($target, $multiplier, $class);
    });
};

!function ($) {

    $(function() {

        /* styleswitch
         ---------------------------------------------------------------------------------------- */

        if($.cookie("css")) {
            $("#target").attr("href", "css/bootstrap." + $.cookie("css") + ".min.css");
        }

        $(".styleswitch").click(function() {
            $("#target").attr("href", "css/bootstrap." + $(this).attr('rel') + ".min.css");
            $.cookie("css", $(this).attr('rel'), {expires: 365, path: '/'});
            return false;
        });


        /* Sidebar left accordion menu */
        if($('nav#sidenav-left').length) {
            $('#accordion').dcAccordion({
                eventType: 'click',
                autoClose: true,
                disableLink: false,
                showCount: false,
                speed: 'fast',
                autoExpand: false,
				saveState: false,
                classExpand: 'dcjq-current-parent',
                cookie: 'antagon-dcjq-accordion'
            });

            /* etoile */
            etoile($('.title-star'), '200', 'display');
        }


        /* anchor scroll */
        function scrollToAnchor($id) {
            var target = $($id);
            if ($(target)) {
                $('html,body').animate({scrollTop: (target.offset().top) - 70}, 'slow', 'linear');
            }
        }

        $(".jump-menu").click(function(evt) {
            if ($(this).attr("href").indexOf('/') == -1) {
                // will not be triggered because str has /
                evt.preventDefault();
                scrollToAnchor($(this).attr("href"));
            }
        });

        // button states
        $("#fat-btn").click(function() {
            var $btn = $(this);
            $btn.button('loading');
            // simulating a timeout
            setTimeout(function () {
                $btn.button('reset');
            }, 1000);
        });

        // toooltip
        $('.tooltip-demo').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        });
        $('.tooltip-test').tooltip();
        $('.popover-test').popover();

        $('.bs-docs-navbar').tooltip({
            selector: "a[data-toggle=tooltip]",
            container: ".bs-docs-navbar .nav"
        });

        // popover demo
        $("[data-toggle=popover]").popover({ trigger: "hover" });

        // image hovers
        $('.thumbnail-slide').hover(
            function(){
                //$(this).find('.caption').stop(true, true).slideDown(150);
                $(this).find('.caption').stop(true, true).slideDown({ duration: 200, easing: "easeInOutQuart" });
            },
            function(){
               // $(this).find('.caption').stop(true, true).slideUp(150);
                $(this).find('.caption').stop(true, true).slideUp({ duration: 200, easing: "easeInOutQuart" });
            }
        );
        $('.thumbnail-fade').hover(
            function(){
                $(this).find('.caption').stop(true, true);
                $(this).find('.caption').fadeIn(200);
            },
            function(){
                $(this).find('.caption').stop(true, true);
                $(this).find('.caption').fadeOut(200);
            }
        );
        $('.download-tooltip').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        });
    });
}(window.jQuery);