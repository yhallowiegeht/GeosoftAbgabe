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
    catch {
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
        catch {
            alert("Bidde korrekten Link");
        }
        })

}

/**
* @desc Deletes the layer 
* source: https://bl.ocks.org/danswick/d30c44b081be31aea483
*/
$('#delete').click(function() {
    try {
        drawnItems.clearLayers();        
        $('#delete').prop('disabled', true);
        $('#download').prop('disabled', true);
        alert("Allet geloescht");
    }
    catch {
        alert("Nix zu loeschn");
    }
})

/**
* represent a file in the database
*/
class databaseobject {
    /**
    * @param{string} name - name of the figures
    * @param{string:json} - boundries of the figures
    */
    constructor(name, json) {
      this.name = name;
      this.json = json;
    }
}
  
/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveToDatabase() {
    var textfield = document.getElementById('GeoJSONname').value;     
    if(textfield.length==0) {
        alert("Error: Bidde gib ein Name");
    }   else {
        var data = drawnItems.toGeoJSON();
        var dbObject = new databaseobject(textfield, "");
        dbObject.json = JSON.stringify(data);
        $.ajax({
            type: 'POST',
            data: dbObject,
            url: "./start",
            success: function(result){
                $('#error').html("gpseochert");
            },
            error: function(xhr,status,error){
                $('#error').html("upsi deees");
            }
        });
    }
}

/**
*@desc Helper function, removes element it's invoked by from DOM
*/
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function coordinateMean(GeoJSON){
    var tempcoordinates = GeoJSON.features[0].geometry.coordinates[0];
    var coordinatesLAT = [];
    var coordinatesLON = [];
    for(var i=0; i<tempcoordinates.length; i++) {
        coordinatesLAT[i] = tempcoordinates[i][1];
        coordinatesLON[i] = tempcoordinates[i][0];
    }
    var LATmean = 0;
    var LONmean = 0;
    for(var j=0; j<(coordinatesLAT.length-1); j++) {
        LATmean += parseFloat(coordinatesLAT[j]);
        LONmean += parseFloat(coordinatesLON[j]);
    }
    LATmean = LATmean / (coordinatesLAT.length-1);
    LONmean = LONmean / (coordinatesLON.length-1);
    var LATLONmean = {LATmean, LONmean};
    return LATLONmean;
}

var ID = [];
function getMensaID() {
    var url = 'http://openmensa.org/api/v2/canteens?near[lat]=51.962981&near[lng]=7.625772&near[dist]=25' 
    fetch(url)
    .then(response => response.json())
    .then(json => {
        for(var i=0; i<json.length; i++){
            ID += json[i].id;
        }
    })
}


function getMensas() {
    var url = 'http://openmensa.org/api/v2/canteens?near[lat]=51.962981&near[lng]=7.625772&near[dist]=25' 
    fetch(url)
    .then(response => response.json())
    .then(json => {
        for(var i=0; i<json.length; i++){
            var gericht = getMotD(json[i].id); 
            L.marker([json[i].coordinates[0], json[i].coordinates[1]]).addTo(map)
                .bindPopup("<h5>"+json[i].name+"<h5><p>Adresse:<br>"+json[i].address+"</p><br>"+gericht+"<br>");
        }
    })
}

function getMotD(ID) {
    var date = new Date();
    date.setHours(date.getHours() + 2);
    var year = date.getFullYear().toString();
    if (date.getMonth() < 9){
        var month = "0"+(date.getMonth()+1).toString();
    } else {
        var month = (date.getMonth()+1).toString();
    }
    var day = date.getDate().toString();
    var linkDate = year+"-"+month+"-"+day;
    var url = "http://openmensa.org/api/v2/canteens/"+ID+"/days/"+linkDate+"/meals"
    var gerichte = "";
    fetch(url)
    .then(response => response.json())
    .then(json => {
        for(var i=0; i<json.length; i++){
            gerichte += json[i].name;
        }
        console.log(gerichte);
        return gerichte;
    })
    
}

$( document ).ready(function()
{
    getMensas();
})