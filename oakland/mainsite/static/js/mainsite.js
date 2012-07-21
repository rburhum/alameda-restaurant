var map;

function init() {

    map = new OpenLayers.Map({
        div: "map",
        //allOverlays: true
    });


    var osm = new OpenLayers.Layer.OSM();
    osm.setIsBaseLayer(true);
    var gmap = new OpenLayers.Layer.Google("Google Streets");
    gmap.setIsBaseLayer(true);

    var local_wms = new OpenLayers.Layer.WMS(
        "ca:alameda - Tiled", "http://localhost:8080/geoserver/ca/wms",
        {
           "transparent":"true",
           "format":"image/png",
           LAYERS: 'ca:alameda',
           STYLES: '',
           tiled: true,
           tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
        },
        {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: false,
            yx : {'EPSG:4326' : true}
        }
    );

    // note that first layer must be visible
    map.addLayers([osm, gmap, local_wms]);

    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.zoomToMaxExtent();

}

$(function() {
    init();
});