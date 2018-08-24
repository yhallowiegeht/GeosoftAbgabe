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
        this.type = "institute";
    }
}

class fachschaft {
    /**
    * @param{string} name - name terminology of fachschaft
    * @param{string} site - URL of the fachschaft
    * @param{} institutes - All institutes belonging to the fachschaft
    */
    constructor(name, site, institutes) {
        this.name = name;
        this.site = site;
        this.institutes = institutes;
        this.type = "fachbereich";
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
        this.type = "route";
    }
}
  
/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveInstToDatabase() {
    var name = document.getElementById('GeoJSONname').value;     
    if(name.length==0) {
        alert("Error: Bidde gib ein Name");
    }   else {
        var data = drawnItems.toGeoJSON();
        var dbObject = new institute(name, "");
        dbObject.json = JSON.stringify(data);
        $.ajax({
            type: 'POST',
            data: dbObject,
            url: '/db/institutes/',
            success: function(result){
                console.log("erfolgreich gespeichert!");
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

/**
 * @desc makes an AJAX post request with the data to later store it in the database
 */
function saveFachToDatabase() {
    var name = document.getElementById('FSname').value;
    console.log(name);     
    if(name.length==0) {
        alert("Error: Bidde gib einen Namen");
    }   else {
        var site = document.getElementById('FSurl').value;
        console.log(site);
        if(site.length==0) {
            alert("Error: Bidde gib eine URL");
        }   else {
            var inst = document.getElementById('institute').value;
            console.log(inst);
            if(inst.length==0) {
                alert("Error: Bidde gib mindestens ein Institut an");
            } else {
                var dbObject = new fachschaft(name, site, inst);
                $.ajax({
                    type: 'POST',
                    data: dbObject,
                    url: '/db/fachbereiche/',
                    success: function(result){
                        console.log("erfolgreich gespeichert!");
                    },
                    error: function(xhr,status,error){
                        console.log(error.info);
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
    var waypoint = control.getWaypoints();
    var name = document.getElementById('rName').value;
    var start = JSON.stringify(waypoint[0]);
    var ziel = JSON.stringify(waypoint[1]);
    if(name.length==0) {
        alert("Bitte Namen eingeben");
        }  else {
            var dbObject = new route(name,start,ziel);
            $.ajax({
                type: 'POST',
                data: dbObject,
                url: '/db/routes/',
                success: function(result){
                    console.log("erfolgreich gespeichert!")
                },
                error: function(xhr,status,error){
                    console.log(error.info)
            }
        });
    }
}

function LoadFachbereichFromDataBase(){
    var name = document.getElementById('fbdbName').value;
    var url = "/db/fachbereiche/"+name+'/'
    var num = name.replace( /^\D+/g, '');
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'GET',
            data: "",
            url: url,
            async:false,
            success: function(res){
                console.log(res);
                document.getElementById('objOut').innerHTML = "Fachschaftsname: "+document.getElementById("FSname")[num].innerHTML+"<br>Abkürzung: "+res[0].name+"<br>Website: "+res[0].site;
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
    var url = "/db/institutes/"+name+"/"
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
                navToMensa(instDB.features[1].geometry.coordinates[1],instDB.features[1].geometry.coordinates[0]);
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
    var url = "/db/routes/"+name+"/"
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'GET',
            data: "",
            url: url,
            async:false,
            success: function(res){
                var start= JSON.parse(res[0].start);
                var end = JSON.parse(res[0].end);
                control.setWaypoints([start, end]);
                console.log("erfolgreich geladen!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}