!function ($) {

    $(function() {

        /* gritter
         -------------------------------------------------------------------------------------------------------- */
        // global setting override
        /*
         $.extend($.gritter.options, {
         class_name: 'gritter-light', // for light notifications (can be added directly to $.gritter.add too)
         position: 'bottom-left', // possibilities: bottom-left, bottom-right, top-left, top-right
         fade_in_speed: 100, // how fast notifications fade in (string or int)
         fade_out_speed: 100, // how fast the notices fade out
         time: 3000 // hang on the screen for...
         });
         */

        $('#add-sticky').on('click', function() {

            var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a sticky notice!',
                // (string | mandatory) the text inside the notification
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/joshaustin.jpg',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            // You can have it return a unique id, this can be used to manually remove it later using
            /*
             setTimeout(function(){

             $.gritter.remove(unique_id, {
             fade: true,
             speed: 'slow'
             });

             }, 6000)
             */

            return false;

        });

        $('#add-regular').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a regular notice!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/joshaustin.jpg',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: false,
                // (int | optional) the time you want it to be alive for before fading out
                time: ''
            });

            return false;

        });

        $('#add-max').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a notice with a max of 3 on screen at one time!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/joshaustin.jpg',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: false,
                // (function) before the gritter notice is opened
                before_open: function(){
                    if($('.gritter-item-wrapper').length == 3)
                    {
                        // Returning false prevents a new gritter from opening
                        return false;
                    }
                }
            });

            return false;

        });

        $('#add-without-image').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a notice without an image!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#">magnis dis parturient</a> montes, nascetur ridiculus mus.'
            });

            return false;
        });

        $('#add-gritter-light').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a light notification - <a href="#">magnis dis parturient</a>',
                // (string | mandatory) the text inside the notification
                text: 'Just add a "gritter-light" class_name to your $.gritter.add or globally to $.gritter.options.class_name',
                class_name: 'gritter-light'
            });

            return false;
        });

        $('#add-with-callbacks').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a notice with callbacks!',
                // (string | mandatory) the text inside the notification
                text: 'The callback is...',
                // (function | optional) function called before it opens
                before_open: function(){
                    alert('I am called before it opens');
                },
                // (function | optional) function called after it opens
                after_open: function(e){
                    alert("I am called after it opens: \nI am passed the jQuery object for the created Gritter element...\n" + e);
                },
                // (function | optional) function called before it closes
                before_close: function(e, manual_close){
                    var manually = (manual_close) ? 'The "X" was clicked to close me!' : '';
                    alert("I am called before it closes: I am passed the jQuery object for the Gritter element... \n" + manually);
                },
                // (function | optional) function called after it closes
                after_close: function(e, manual_close){
                    var manually = (manual_close) ? 'The "X" was clicked to close me!' : '';
                    alert('I am called after it closes. ' + manually);
                }
            });

            return false;
        });

        $('#add-sticky-with-callbacks').click(function(){

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a sticky notice with callbacks!',
                // (string | mandatory) the text inside the notification
                text: 'Sticky sticky notice.. sticky sticky notice...',
                // Stickeh!
                sticky: true,
                // (function | optional) function called before it opens
                before_open: function(){
                    alert('I am a sticky called before it opens');
                },
                // (function | optional) function called after it opens
                after_open: function(e){
                    alert("I am a sticky called after it opens: \nI am passed the jQuery object for the created Gritter element...\n" + e);
                },
                // (function | optional) function called before it closes
                before_close: function(e){
                    alert("I am a sticky called before it closes: I am passed the jQuery object for the Gritter element... \n" + e);
                },
                // (function | optional) function called after it closes
                after_close: function(){
                    alert('I am a sticky called after it closes');
                }
            });

            return false;

        });

        $("#remove-all").click(function(){

            $.gritter.removeAll();
            return false;

        });

        $("#remove-all-with-callbacks").click(function(){

            $.gritter.removeAll({
                before_close: function(e){
                    alert("I am called before all notifications are closed.  I am passed the jQuery object containing all  of Gritter notifications.\n" + e);
                },
                after_close: function(){
                    alert('I am called after everything has been closed.');
                }
            });
            return false;

        });

        // MODAL
        var $modal = $('#ajax-modal');

        $('.ajax.demo').on('click', function(){
            // create the backdrop and wait for next modal to be triggered
            $('body').modalmanager('loading');

            setTimeout(function(){
                $modal.load('modal_ajax_test.html', '', function(){
                    $modal.modal();
                });
            }, 1000);
        });

        $modal.on('click', '.update', function(){
            $modal.modal('loading');
            setTimeout(function(){
                $modal
                    .modal('loading')
                    .find('.modal-body')
                    .prepend('<div class="alert alert-info fade in">' +
                        'Updated!<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '</div>');
            }, 1000);
        });

    });
}(window.jQuery);