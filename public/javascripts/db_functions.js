'use strict';

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

class fachschaft {
    /**
    * @param{string} short - short terminology of fachschaft
    * @param{string} site - URL of the fachschaft
    * @param{} institutes - All institutes belonging to the fachschaft
    */
    constructor(short, site, institutes) {
        this.short = short;
        this.site = site;
        this.institutes = institutes;
    }
}

class route {
    /**
    * @param{string} name - name of the figures
    * @param{string} start - start of the route
    * @param{string} end - end of the route
    */
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
    }
}
  
/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveInstToDatabase() {
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
            url: "/db/",
            success: function(result){
                alert("erfolgreich gespeichert!");
            },
            error: function(xhr,status,error){
                alert(error);
            }
        });
    }
}

/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveFachToDatabase() {
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
                var dbObject = new fachschaft(short, site, "");
                $.ajax({
                    type: 'POST',
                    data: dbObject,
                    url: "/db/",
                    success: function(result){
                        alert("erfolgreich gespeichert!");
                    },
                    error: function(xhr,status,error){
                        alert(error);
                    }
                });
            }
        }
    }
}

/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveRouteToDatabase() {
    var waypoint = control.getWaypoints() 
    
    var name = document.getElementById('rName').value;
    var ziel = waypoint[1].name;
    var start = waypoint[0].name;

    if(name.length==0) {
        alert("Bitte Namen eingeben");
        }  else {
            var dbObject = new route(name,start,ziel);
            $.ajax({
                type: 'POST',
                data: dbObject,
                url: "/db/",
                success: function(result){
                    console.log("Erfolg")
                },
                error: function(xhr,status,error){
                    console.log("Miserfolg")
            }
        });
    }
}

function LoadFachbereichFromDataBase(){
    var name = document.getElementById('fbdbName').value;
    var url = "/db/"+name+'/'
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'GET',
            data: "",
            url: url,
            async:false,
            success: function(res){
                document.getElementById('objOut').innerHTML = "Fachschaftsname: "+res[0].name+"<br>Abkürzung: "+res[0].short+"<br>Website:"+res[0].site;
                console.log("erfolgreich geladen!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function LoadInstituteFromDataBase(){
    var name = document.getElementById('instdbName').value;
    var url = "/db/"+name+"/"
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'GET',
            data: "",
            url: url,
            async:false,
            success: function(res){
                var instDB = JSON.parse(res[0].json);
                var layer = L.geoJson(instDB.features[0]).addTo(map);
                var marker = L.marker([instDB.features[1].geometry.coordinates[1], instDB.features[1].geometry.coordinates[0]]);             
                marker.addTo(map).bindPopup("<h5>"+instDB.features[0].features[0].properties.name+"<h5><img src="+instDB.features[0].features[0].properties.img+" width='200'><br>").openPopup();
                drawnItems.addLayer(layer);
                drawnItems.addLayer(marker);
                console.log("erfolgreich geladen!");                
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function LoadRoutenFromDataBase(){
    var name = document.getElementById('routedbName').value;
    var url = "/db/"+name+"/"
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'GET',
            data: "",
            url: url,
            async:false,
            success: function(res){
                console.log(res[0].start);
                console.log("erfolgreich geladen!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}