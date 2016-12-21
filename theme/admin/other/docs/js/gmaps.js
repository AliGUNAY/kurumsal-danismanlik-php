!function ($) {

    $(function() {

        // basic
        new GMaps({
            div: '#gmap-basic',
            lat: -12.043333,
            lng: -77.028333
        });

        // markers
        var map = new GMaps({
            div: '#gmap-marker',
            lat: -12.043333,
            lng: -77.028333
        });
        map.addMarker({
            lat: -12.043333,
            lng: -77.028333,
            title: 'Lima',
            click: function(e) {
                alert('You clicked in this marker');
            }
        });

        // geolocation
        var mapGeo = new GMaps({
            div: '#gmap-geo',
            lat: -12.043333,
            lng: -77.028333
        });

        GMaps.geolocate({
            success: function(position){
                mapGeo.setCenter(position.coords.latitude, position.coords.longitude);
            },
            error: function(error){
                alert('Geolocation failed: '+error.message);
            },
            not_supported: function(){
                alert("Your browser does not support geolocation");
            },
            always: function(){
                alert("Geolocation done!");
            }
        });

        // geocoding
        var mapGeocode = new GMaps({
            div: '#gmap-geocode',
            lat: -12.043333,
            lng: -77.028333
        });
        $('#geocoding_form').submit(function(e){
            e.preventDefault();
            GMaps.geocode({
                address: $('#address').val().trim(),
                callback: function(results, status){
                    if(status=='OK'){
                        var latlng = results[0].geometry.location;
                        mapGeocode.setCenter(latlng.lat(), latlng.lng());
                        mapGeocode.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng()
                        });
                    }
                }
            });
        });

        // polylines
        var mapPoly = new GMaps({
            div: '#gmap-polyline',
            lat: -12.043333,
            lng: -77.028333,
            click: function(e){
                //console.log(e);
            }
        });

        path = [[-12.044012922866312, -77.02470665341184], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];

        mapPoly.drawPolyline({
            path: path,
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
        });
        mapPoly.setZoom(12);

        // polygon
        var mapPolygon = new GMaps({
            div: '#gmap-polygon',
            lat: -12.043333,
            lng: -77.028333
        });

        var path = [[-12.040397656836609,-77.03373871559225],
            [-12.040248585302038,-77.03993927003302],
            [-12.050047116528843,-77.02448169303511],
            [-12.044804866577001,-77.02154422636042]];

        polygon = mapPolygon.drawPolygon({
            paths: path,
            strokeColor: '#BBD8E9',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#BBD8E9',
            fillOpacity: 0.6
        });


    });
}(window.jQuery);