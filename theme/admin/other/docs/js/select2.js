!function ($) {

    $(function() {

        var placeholder = "Select a State";

        $('.select2, .select2-multiple').select2({ placeholder: placeholder });
        $('.select2-allow-clear').select2({ allowClear: true, placeholder: placeholder });
        $('.select2-remote').select2({
            placeholder: "Search for a movie",
            minimumInputLength: 1,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                dataType: 'jsonp',
                data: function (term, page) {
                    return {
                        q: term, // search term
                        page_limit: 10, // page size
                        page: page, // page number
                        apikey: "w2uyd7u9mj53nhq2f8mpzquq" // please do not use so this example keeps working
                    };
                },
                results: function (data, page) {
                    var more = (page * 10) < data.total; // whether or not there are more results available

                    // notice we return the value of more so Select2 knows if more results can be loaded
                    return {results: data.movies, more: more};
                }
            },
            initSelection: function(element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected
                var id=$(element).val();
                if (id!=="") {
                    $.ajax("http://api.rottentomatoes.com/api/public/v1.0/movies/"+id+".json", {
                        data: {
                            apikey: "w2uyd7u9mj53nhq2f8mpzquq"
                        },
                        dataType: "jsonp"
                    }).done(function(data) { callback(data); });
                }
            },
            formatResult: movieFormatResult, // omitted for brevity, see the source of this page
            formatSelection: movieFormatSelection,  // omitted for brevity, see the source of this page
            dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
        });

        function movieFormatResult(movie) {
            var markup = "<table class='movie-result'><tr>";
            if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
                markup += "<td class='movie-image'><img src='" + movie.posters.thumbnail + "'/></td>";
            }
            markup += "<td class='movie-info'><div class='movie-title'>" + movie.title + "</div>";
            if (movie.critics_consensus !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>";
            }
            else if (movie.synopsis !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>";
            }
            markup += "</td></tr></table>"
            return markup;
        }

        function movieFormatSelection(movie) {
            return movie.title;
        }

        $('button[data-select2-open]').click(function(){
            $('#' + $(this).data('select2-open')).select2('open');
        });


        var select2OpenEventName = "select2-open";

        $(':checkbox').on( "click", function() {
            $(this).parent().nextAll('select').select2("enable", this.checked );
        });


        $(".select2, .select2-multiple, .select2-allow-clear, .select2-remote").on( select2OpenEventName, function() {
            if ( $(this).parents('[class*="has-"]').length ) {
                var classNames = $(this).parents('[class*="has-"]')[0].className.split(/\s+/);
                for (var i=0; i<classNames.length; ++i) {
                    if ( classNames[i].match("has-") ) {
                        $('#select2-drop').addClass( classNames[i] );
                    }
                }
            }

        });

    });
}(window.jQuery);