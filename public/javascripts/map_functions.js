'use strict';

/**
* @desc Reads the geojson/URL
*/
function readGeoJSONFromTA() {
    return JSON.parse($('textarea#geojson-area')[0].value);
}

function readURLFromTA() {
    var url = document.getElementById('url-area').value;
    $.getJSON(url, function(data) {
    return text(data.result);
    });
}
/**
*@desc add and load the read GeoJSON/URL on the map
*/
function loadGeoJSON() {
    try {
        var feat = readGeoJSONFromTA();
        geoJSOndrawn = L.geoJson(feat);
    }
    catch {
        alert("Bidde korrektes JSON");
    }
}
function loadURL() {
    var feat = readURLFromTA();
    currentGeojson += L.geoJson(feat);
    drawnItems.addTo(map);
}

/**
* @desc Deletes the layer 
* source: https://bl.ocks.org/danswick/d30c44b081be31aea483
*/
$('#delete').click(function() {
    try {
        drawnItems.clearLayers();
        alert("Allet geloescht");
        $('#delete').prop('disabled', true);
        $('#download').prop('disabled', true);
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
    constructor(name, json, pic) {
      this.name = name;
      this.json = json;
      this.picture = pic;
    }
}
  
/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveToDatabase() {
    var textfield = document.getElementById('GeoJSONname').value; 
    var pictureURL = document.getElementById('PicURL').value;
    
    if(textfield.length==0) {
        alert("Error: Bidde gib ein Name");
    }   else {
        var data = drawnItems.toGeoJSON();
        var dbObject = new databaseobject(textfield, "",pictureURL);
        dbObject.json = JSON.stringify(data);
        alert("Objekt erfolgreich gespeichert!");
        $.ajax({
            type: 'POST',
            data: dbObject,
            url: "./start",
        });
    }
}

/**
*@desc Helper function, removes element it's invoked by from DOM
*/
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}
