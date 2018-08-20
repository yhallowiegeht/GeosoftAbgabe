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
class institute {
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
* represent a file in the database
*/
class fachschaft {
    /**
    * @param{string} name - name of the figures
    * @param{string:json} - boundries of the figures
    */
    constructor(name, short, site, institutes) {
      this.name = name;
      this.short = short;
      this.site = site;
      this.institutes = institutes;
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
        var dbObject = new institute(textfield, "");
        dbObject.json = JSON.stringify(data);
        $.ajax({
            type: 'POST',
            data: dbObject,
            url: "./start",
            success: function(result){
                alert("erfolgreich gespeichert!");
            },
            error: function(xhr,status,error){
                alert("upsi deees");
            }
        });
    }
}

/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveToDatabase2() {
    var name = document.getElementById('FSname').value;     
    if(name.length==0) {
        alert("Error: Bidde gib ein vernünftige Name");
    }   else {
        var short = document.getElementById('abk').value;
        if(short.length!=3) {
            alert("Error: Bidde gib eine Abk");
        }   else {
            var site = document.getElementById('FSurl-area').value;
            if(short.length==0) {
                alert("Error: Bidde gib eine URL");
            }   else {
                var dbObject = new fachschaft(name, short, site, "");
                $.ajax({
                    type: 'POST',
                    data: dbObject,
                    url: "./start",
                    success: function(result){
                        alert("erfolgreich gespeichert!");
                    },
                    error: function(xhr,status,error){
                        alert("upsi deees!");
                    }
                });
            }
        }
    }
}

/**
*@desc Helper function, removes element it's invoked by from DOM
*/
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

$('#GeoJSON').click(function(){
    $('#URL-field').hide();
    $('#GeoJSON-field').show();
});

$("#URL").click(function(){
    $('#GeoJSON-field').hide();
    $('#URL-field').show();

});

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

function getMensas() {
    var open = "<sup style='font-size:6px; letter-spacing:3px; color: #4EAF47;' id='open'>GEO<span id='offset'>EFF</span>NET</sup><br>"
    var closed = "<sup style='font-size:6px; letter-spacing:3px; color: #e51010' id='open'>GESC<span id='offset'>HLOS</span>SEN</sup>"
    
    var url = 'http://openmensa.org/api/v2/canteens?near[lat]=51.962981&near[lng]=7.625772&nebrar[dist]=25' 
    
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
    
    var alleMensen
    fetch(url)
    .then(response => response.json())
    .then(json => {
        alleMensen = json
        console.log(alleMensen);
        
        alleMensen.map((mensa)=>{
            var url2 = "http://openmensa.org/api/v2/canteens/"+mensa.id+"/days/"+linkDate+"/meals"
            fetch(url2)
            .then((response)=>{
                if (response.ok) {
                    return response.json() 
                } else {
                    L.marker([mensa.coordinates[0], mensa.coordinates[1]], {icon: redIcon}).addTo(map)
                        .bindPopup("<h4>"+mensa.name+"  "+closed+"</h4><p><em>"+mensa.address+"</em></p>")
                }
            })
            .then((json)=>{
                var gerichte=""
                json.map((gericht)=>{
                    gerichte+="<ins>"+gericht.category+"</ins>: "+gericht.name+" [Studenten: "+gericht.prices.students+"€, Mitarbeiter: "+gericht.prices.employees+"€, Andere: "+gericht.prices.others+"€]<br><br>"
                })
                L.marker([mensa.coordinates[0], mensa.coordinates[1]], {icon: greenIcon}).addTo(map)
                    .bindPopup("<h4>"+mensa.name+"  "+open+"</h4><em>"+mensa.address+"</em><br><h5>Tagesgerichte:</h5>"+gerichte);
            })
        })
    })
}

$( document ).ready(function()
{
    getMensas();
    $('#URL-field').hide();
/*  $('#download2').attr('disabled',true);
        $('#FSname').keyup(function () {
        if ($(this).val().length != 0)
            $('#abk').keyup(function () {
                if ($(this).val().length == 3)
                    $('#FSurl-area').keyup(function () {
                        if ($(this).val().length != 0)
                            $('#download2').attr('disabled', false);
                        else
                            $('#download2').attr('disabled', true);
                    })
            })
    }) */
})