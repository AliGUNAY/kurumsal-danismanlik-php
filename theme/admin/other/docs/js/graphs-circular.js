!function ($) {

    $(function() {

        /* jQuery knob
         ---------------------------------------------------------- */
        $(".knob").knob({
            change : function (value) {
                //console.log("change : " + value);
            },
            release : function (value) {
                //console.log(this.$.attr('value'));
                //console.log("release : " + value);
            },
            cancel : function () {
                //console.log("cancel : ", this);
            }
        });


        /* justGage
         ---------------------------------------------------------- */
        var g1 = new JustGage({
            id: "g1",
            value: getRandomInt(0, 100),
            min: 0,
            max: 100,
            title: "Big Fella",
            label: "pounds"
        });

        var g2 = new JustGage({
            id: "g2",
            value: getRandomInt(0, 100),
            min: 0,
            max: 100,
            title: "Small Buddy",
            label: "oz"
        });

        var g3 = new JustGage({
            id: "g3",
            value: getRandomInt(0, 100),
            min: 0,
            max: 100,
            title: "Tiny Lad",
            label: "oz"
        });

        setInterval(function() {
            g1.refresh(getRandomInt(50, 100));
            g2.refresh(getRandomInt(50, 100));
            g3.refresh(getRandomInt(0, 50));
        }, 2500);

        var g4 = new JustGage({
            id: "g4",
            value: getRandomInt(0, 100),
            min: 0,
            max: 100,
            title: "Animation effects",
            label: "pounds",
            startAnimationType: "bounce"
        });

        var g5 = new JustGage({
            id: "g5",
            value: getRandomInt(0, 230),
            min: 0,
            max: 230,
            title: "Gauge width",
            label: "members",
            gaugeWidthScale: ".2"
        });

        var myColors = ["#3498DB", "#8A9B0F", "#E97F02", "#E74C3C", "#490A3D"];
        var g6 = new JustGage({
            id: "g6",
            value: getRandomInt(0, 100),
            min: 0,
            max: 100,
            title: "Alternate level colors",
            label: "units",
            levelColors : myColors
        });

        setInterval(function() {
            g4.refresh(getRandomInt(50, 100));
            g5.refresh(getRandomInt(50, 100));
            g6.refresh(getRandomInt(0, 50));
        }, 2500);

    });
}(window.jQuery);