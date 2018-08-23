'use strict';

/**
* @desc Reads the geojson/URL
*/
function readGeoJSONFromTA() {
    return JSON.parse($('textarea#geojson-area')[0].value);
}

function readURLFromTA() {
    var url = document.getElementById('url-area').value;
    fetch(url)
    .then(response => response.json())
    .then(json => {
        JASON = json;
    })
}
/**
*@desc add and load the read GeoJSON/URL on the map
*/
function loadGeoJSON() {
    var feat = readGeoJSONFromTA();
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
        $('#delete').prop('disabled', false);
        $('#download').prop('disabled', false);    
    }
    catch (err) {
        alert("Bidde korrektes JSON");
    }
}

function loadURL() {
        var feat;
        var url = document.getElementById('url-area').value;
        fetch(url)
        .then(response => response.json())
        .then(json => {
            feat = json;
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
            $('#delete').prop('disabled', false);
            $('#download').prop('disabled', false); 
        }
        catch (err) {
            alert("Bidde korrekten Link");
        }
        })
}

$('#GeoJSON').click(function(){
    $('#URL-field').hide();
    $('#GeoJSON-field').show();
});

$("#URL").click(function(){
    $('#GeoJSON-field').hide();
    $('#URL-field').show();

});

$('#dbInstitute').click(function(){
    $('#dbRouten-field').hide();
    $('#dbFachbereiche-field').hide();
    $('#dbInstitute-field').show();
});

$("#dbFachbereiche").click(function(){
    $('#dbRouten-field').hide();
    $('#dbInstitute-field').hide();
    $('#dbFachbereiche-field').show();

});

$('#dbRouten').click(function(){
    $('#dbInstitute-field').hide();
    $('#dbFachbereiche-field').hide();
    $('#dbRouten-field').show();
});

$(document).ready(function(){
    $('#dbInstitute-field').hide();
    $('#dbFachbereiche-field').hide();
    $('#dbRouten-field').hide();
    $('#URL-field').hide();    
});