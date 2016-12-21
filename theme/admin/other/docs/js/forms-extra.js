!function ($) {

    $(function() {

        /* datetime picker
         ---------------------------------------------------------- */
        $('#datetimepicker1').datetimepicker({
            language: 'en',
            pick12HourFormat: true
        });

        $('#datetimepicker2').datetimepicker({
            pickDate: false
        });

        $('#datetimepicker3').datetimepicker({
            pickTime: false
        });

        /* date range picker
         ---------------------------------------------------------- */
        $('#reservation').daterangepicker();

        $('#reservationtime').daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            format: 'MM/DD/YYYY h:mm A'
        });

        $('#reportrange').daterangepicker(
            {
                startDate: moment().subtract('days', 29),
                endDate: moment(),
                minDate: '01/01/2012',
                maxDate: '12/31/2014',
                dateLimit: { days: 60 },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                opens: 'left',
                buttonClasses: ['btn'],
                applyClass: 'btn-small btn-success',
                cancelClass: 'btn-small btn-default',
                format: 'MM/DD/YYYY',
                separator: ' to ',
                locale: {
                    applyLabel: 'Submit',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom Range',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                }
            },
            function(start, end) {
                //console.log("Callback has been called!");
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        );
        //Set the initial state of the picker label
        $('#reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));


        /* colorpicker
         ---------------------------------------------------------- */
        $('#cp1').colorpicker({
            format: 'hex'
        });
        $('#cp2').colorpicker();
        $('#cp3').colorpicker();
        var bodyStyle = $('body')[0].style;
        $('#cp4').colorpicker().on('changeColor', function(ev){
            bodyStyle.backgroundColor = ev.color.toHex();
        });

        /* Zabuto Calendar
         ---------------------------------------------------------- */
        $("#my-calendar").zabuto_calendar({
            language: "en",
            cell_border: true,
            today: true,
            show_days: false,
            weekstartson: 0,
            nav_icon: {
                prev: '<i class="fa fa-angle-double-left"></i>',
                next: '<i class="fa fa-angle-double-right"></i>'
            },
            action: function() { alert("clicked") }
        });

    });
}(window.jQuery);