'use strict';

/**
* @desc Reads the geojson/URL
*/
function readGeoJSONFromTA(textfield) {
    return JSON.parse($(textfield)[0].value);
}

/**
* @desc add and load the read GeoJSON/URL on the map
*/
function loadGeoJSON(textfield, upload) {
    var feat = readGeoJSONFromTA(textfield);
    var bild = feat.features[0].properties.img;
    var iname = feat.features[0].properties.name;
    var laylay = L.geoJson(feat);
    var LATLON = coordinateMean(feat);
    var maymay = L.marker([LATLON.LATmean, LATLON.LONmean]);
    try {
        laylay.addTo(map);
        maymay.addTo(map).bindPopup("<h5>"+iname+"<h5><img src="+bild+" width='200'><br>").openPopup();
        drawnItems.addLayer(laylay);
        drawnItems.addLayer(maymay);
        $(upload).prop('disabled', false);
        $('#deleteLayer').prop('disabled', false);   
    }
    catch (err) {
        alert("Bidde korrektes JSON");
    }
}

function loadURL(urlfield, upload) {
    var url = document.getElementById(urlfield).value;
    fetch(url)
    .then(response => response.json())
    .then(json => {
        var feat = json;
        var bild = feat.features[0].properties.img;
        var iname = feat.features[0].properties.name;
        var laylay = L.geoJson(feat);
        var LATLON = coordinateMean(feat);
        var maymay = L.marker([LATLON.LATmean, LATLON.LONmean]);
    try {    
        laylay.addTo(map);
        maymay.addTo(map).bindPopup("<h5>"+iname+"<h5><img src="+bild+" width='200'><br>").openPopup();
        drawnItems.addLayer(laylay);
        drawnItems.addLayer(maymay);
        $(upload).prop('disabled', false);
        $('#deleteLayer').prop('disabled', false);
    }
    catch (err) {
        alert("Bidde korrekten Link");
    }
    })
}