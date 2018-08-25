'use strict';

/**
 * each class represents a file in the database
 */
class institute {
    /**
    * @param{string} name - name of the polygon
    * @param{string:json} - geometry of the polygon 
    */
    constructor(name, json) {
        this.name = name;
        this.json = json;
        //this.type = "institute";
    }
}

class fachschaft {
    /**
    * @param{string} name - name terminology of fachschaft
    * @param{string} site - URL of the fachschaft
    * @param{string} institutes - All institutes belonging to the fachschaft
    * @param{string} abk - short 3 figure version of fachschaft
    */
    constructor(name, abk, site, inst) {
        this.name = name;
        this.abk = abk;
        this.site = site;
        this.inst = inst;
        //this.type = "fachbereich";
    }
}

class route {
    /**
    * @param{string} name - name of the route
    * @param{string:json} start - start of the route
    * @param{string:json} end - end of the route
    */
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
        //this.type = "route";
    }
}
  
/**
 * @desc makes an AJAX post request with the data to later store it in the database
 * save functions for institutes, fachbereiche and routes
 */
function saveINSTtoDB() {
    var name = document.getElementById('sInstName').value;
    console.log(name);     
    if(name.length==0) {
        alert("Error: Bidde gib ein Name");
    }   else {
        var data = drawnItems.toGeoJSON();
        console.log(data);
        var dbObject = new institute(name, "");
        dbObject.json = JSON.stringify(data);
        console.log(dbObject);
        $.ajax({
            type: 'POST',
            data: dbObject,
            url: './db/institutes',
            success: function(result){
                console.log("erfolgreich gespeichert!");
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function saveFBtoDB() {
    var name = document.getElementById('FbSaveName').value;
    console.log(name);     
    if(name.length==0) {
        alert("Error: Bidde gib einen Namen");
    }   else {
        var abk = document.getElementById('FbSaveAbk').value;
        console.log(abk);     
        if(abk.length!=3) {
            alert("Error: Bidde gib vernünftige Abkürzung");
        }   else {
            var site = document.getElementById('FbSaveUrl').value;
            console.log(site);
            if(site.length==0) {
                alert("Error: Bidde gib eine URL");
            }   else {
                var inst = document.getElementById('FbSaveInstitute').value;
                console.log(inst);
                if(inst.length==0) {
                    alert("Error: Bidde gib mindestens ein Institut an");
                } else {
                    var dbObject = new fachschaft(name, abk, site, inst);
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
}

function saveRtoDB() {
    var waypoint = control.getWaypoints();
    var start = JSON.stringify(waypoint[0]);
    var ziel = JSON.stringify(waypoint[1]);
    var name = document.getElementById('rSaveName').value;
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
/**
 * @desc makes an AJAX get request with the name to retrieve data from the database 
 * load functions for institutes, fachbereiche and routes
 */
function LoadINSTfromDB(){
    var name = document.getElementById('InstLoadDbName').value;
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

function loadFBfromDB(){
    var name = document.getElementById('FbLoadName').value;
    var url = "/db/fachbereiche/"+name+'/'
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
                document.getElementById('objOut').innerHTML = "Fachschaftsname: "+res[0].name+"<br>Abkürzung: "+res[0].abk+"<br>Website: "+res[0].site+"<br>Institute:"+res[0].inst;
                console.log("erfolgreich geladen!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function loadRfromDB(){
    var name = document.getElementById('rLoadName').value;
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

/**
 * @desc makes an AJAX put request with the data to update it in the database
 * update functions for institutes, fachbereiche and routes
 */
function updateINSTinDB() {
    var name = document.getElementById('InstUpdateDbName').value;     
    if(name.length==0) {
        alert("Error: Bidde gib ein Name");
    }   else {
        var data = drawnItems.toGeoJSON();
        var dbObject = new institute(name, "");
        dbObject.json = JSON.stringify(data);
        $.ajax({
            type: 'PUT',
            data: dbObject,
            url: '/db/institutes/',
            success: function(result){
                console.log("erfolgreich geupdated!");
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function updateFBinDB() {
    var name = document.getElementById('FbUpdateName').value;
    console.log(name);     
    if(name.length==0) {
        alert("Error: Bidde gib einen Namen");
    }   else {
        var site = document.getElementById('FbUpdateUrl').value;
        console.log(site);
        if(site.length==0) {
            alert("Error: Bidde gib eine URL");
        }   else {
            var inst = document.getElementById('FbUpdateInstitute').value;
            console.log(inst);
            if(inst.length==0) {
                alert("Error: Bidde gib mindestens ein Institut an");
            } else {
                var dbObject = new fachschaft(name, site, inst);
                $.ajax({
                    type: 'PUT',
                    data: dbObject,
                    url: '/db/fachbereiche/',
                    success: function(result){
                        console.log("erfolgreich geupdated!");
                    },
                    error: function(xhr,status,error){
                        console.log(error.info);
                    }
                });
            }
        }
    }
}

function updateRinDB() {
    var waypoint = control.getWaypoints();
    var name = document.getElementById('rUpdateName').value;
    var start = JSON.stringify(waypoint[0]);
    var ziel = JSON.stringify(waypoint[1]);
    if(name.length==0) {
        alert("Bitte Namen eingeben");
        }  else {
            var dbObject = new route(name,start,ziel);
            $.ajax({
                type: 'PUT',
                data: dbObject,
                url: '/db/routes/',
                success: function(result){
                    console.log("erfolgreich geupdated!")
                },
                error: function(xhr,status,error){
                    console.log(error.info)
            }
        });
    }
}
/**
 * @desc makes an AJAX put request with the data to update it in the database
 * update functions for institutes, fachbereiche and routes
 */
function deleteINSTfromDB(){
    var name = document.getElementById('InstDeleteDbName').value;
    var url = "/db/institutes/"+name+"/"
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'DELETE',
            url: url,
            async:false,
            success: function(res){
                console.log("erfolgreich geloescht!");                
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function deleteFBfromDB(){
    var name = document.getElementById('FbDeleteName').value;
    var url = "/db/fachbereiche/"+name+'/'
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'DELETE',
            url: url,
            async:false,
            success: function(res){
                console.log("erfolgreich geloescht!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}

function deleteRfromDB(){
    var name = document.getElementById('rDeleteName').value;
    var url = "/db/routes/"+name+"/"
    if(name.length==0) {
        alert("Error: Bidde gib ein Name ein");
    }   else {
        $.ajax({
            type: 'DELETE',
            url: url,
            async:false,
            success: function(res){
                console.log("erfolgreich geloescht!");    
            },
            error: function(xhr,status,error){
                console.log(error.info);
            }
        });
    }
}