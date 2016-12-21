!function ($) {

    $(function() {

        // basic
        $('#basic').dataTable( {
            "sPaginationType": "bs_normal",
            "oLanguage": {
                "oPaginate": {
                    "sPrevious": "",
                    "sNext": ""
                },
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ records",
                "sLengthMenu": "_MENU_ records",
                "sInfoEmpty": "Showing 0 to 0 of 0 records",
                "sInfoFiltered": "(filtered from _MAX_ total records)",
                "sSearch": "<span class=\"datatables_search\">Search:</span>"
            }
        });

        // adding Bootstrap form-control manually
        // post by Jorex (August 2013): https://www.datatables.net/forums/discussion/16809/bootstrap-3
        $('#basic_length label select').addClass('form-control');
        $('#basic_filter label input').addClass('form-control').css("width", "150px");
        //set alternate pagination style
        $('#basic').closest('.row').find('.pagination').addClass('pagination-nocolor');

        // basic 2

        $('#basic2').dataTable( {
            "aaSorting": [[ 2, "asc" ]],
            "sPaginationType": "bs_normal",
            "oLanguage": {
                "oPaginate": {
                    "sPrevious": "",
                    "sNext": ""
                },
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ records",
                "sLengthMenu": "_MENU_ records",
                "sInfoEmpty": "Showing 0 to 0 of 0 records",
                "sInfoFiltered": "(filtered from _MAX_ total records)",
                "sSearch": "<span class=\"datatables_search\">Search:</span>"
            }
        });
        $('#basic2_length label select').addClass('form-control');
        $('#basic2_filter label input').addClass('form-control').css("width", "150px");
    });
}(window.jQuery);