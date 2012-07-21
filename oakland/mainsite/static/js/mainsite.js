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

    highlightLayer = new OpenLayers.Layer.Vector("Highlighted Features", {
            displayInLayerSwitcher: false,
            isBaseLayer: false
        }
    );

    infoControls = {
        click: new OpenLayers.Control.WMSGetFeatureInfo({
            url: 'http://localhost:8080/geoserver/ca/wms',
            title: 'Identify features by clicking',
            layers: [local_wms],
            queryVisible: true
        }),
        hover: new OpenLayers.Control.WMSGetFeatureInfo({
            url: 'http://localhost:8080/geoserver/ca/wms',
            title: 'Identify features by clicking',
            layers: [local_wms],
            hover: true,
            // defining a custom format options here
            formatOptions: {
                typeName: 'water_bodies',
                featureNS: 'http://www.openplans.org/topp'
            },
            queryVisible: true
        })
    };


    for (var i in infoControls) {
        infoControls[i].events.register("getfeatureinfo", this, showInfo);
        map.addControl(infoControls[i]);
    }

    infoControls.click.activate();

    map.addLayer(highlightLayer);



    // note that first layer must be visible

    map.addLayers([osm, gmap, local_wms]);

    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.zoomToMaxExtent();

    /*
    // Selection code
    select = new OpenLayers.Layer.Vector("Selection", {styleMap:
        new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
    });
    hover = new OpenLayers.Layer.Vector("Hover");
    map.addLayers([hover, select]);

    control = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(local_wms),
        box: true,
        hover: true,
        multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });
    control.events.register("featureselected", this, function(e) {
        select.addFeatures([e.feature]);
    });
    control.events.register("featureunselected", this, function(e) {
        select.removeFeatures([e.feature]);
    });
    control.events.register("hoverfeature", this, function(e) {
        hover.addFeatures([e.feature]);
    });
    control.events.register("outfeature", this, function(e) {
        hover.removeFeatures([e.feature]);
    });
    map.addControl(control);
    control.activate();
    */

}

function showInfo(evt) {
    if (evt.features && evt.features.length) {
        highlightLayer.destroyFeatures();
        highlightLayer.addFeatures(evt.features);
        highlightLayer.redraw();
    } else {
        document.getElementById('responseText').innerHTML = evt.text;
    }
}

function toggleControl(element) {
    for (var key in infoControls) {
        var control = infoControls[key];
        if (element.value == key && element.checked) {
            control.activate();
        } else {
            control.deactivate();
        }
    }
}

function toggleFormat(element) {
    for (var key in infoControls) {
        var control = infoControls[key];
        control.infoFormat = element.value;
    }
}

$(function() {
    init();
});