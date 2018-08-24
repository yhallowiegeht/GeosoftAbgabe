'use strict';

function getMensa() {
    var open = "<sup style='font-size:6px; letter-spacing:3px; color: #4EAF47;' id='open'>GEO<span id='offset'>EFF</span>NET</sup><br>"
    var closed = "<sup style='font-size:6px; letter-spacing:3px; color: #e51010' id='open'>GESC<span id='offset'>HLOS</span>SEN</sup>"
    
    var url = 'http://openmensa.org/api/v2/canteens?near[lat]=51.962981&near[lng]=7.625772&nebrar[dist]=25' 
    getCurrentTime();
    var alleMensen
    fetch(url)
    .then(response => response.json())
    .then(json => {
        alleMensen = json
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
                if (typeof json !== 'undefined') {
                    var gerichte=""
                    json.map((gericht)=>{
                        gerichte+="<ins>"+gericht.category+"</ins>: "+gericht.name+" [Studenten: "+gericht.prices.students+"€, Mitarbeiter: "+gericht.prices.employees+"€, Andere: "+gericht.prices.others+"€]<br><br>"
                    })
                    L.marker([mensa.coordinates[0], mensa.coordinates[1]], {icon: greenIcon}).addTo(map)
                        .bindPopup("<h4>"+mensa.name+"  "+open+"</h4><em>"+mensa.address+"</em><br><h5>Tagesgerichte:</h5>"+gerichte);
                }
            })
        })
    })
}

/**
* Show the Route to the nearest Mensa for a given lat,lon 
* credit to N Asse for glorious work with this abgabe
*/
function navToMensa(lat,lon){
    var Mensen
    var Mensen2
    var Abstand = []
    var ID = []
    //var index = 1
    var url = 'http://openmensa.org/api/v2/canteens?near[lat]=51.9629731&near[lng]=7.625654&nebrar[dist]=20' 
    fetch(url)
    .then(response => response.json())
    .then(json => {
        for(var i = 1; i < json.length; i++) {
            Abstand.push(distance(json[i].coordinates[0], json[i].coordinates[1],lat,lon));
            ID.push(json[i].id);
        }
        var min = Math.min(...Abstand);
        var min2 = Abstand.indexOf(min,0);
        var url2 = "http://openmensa.org/api/v2/canteens/"+ID[min2]
        fetch(url2)
        .then(response => response.json())
        .then(json => {
            control.setWaypoints([
                L.latLng(lat, lon),
                L.latLng(json.coordinates[0],json.coordinates[1]) 
              ]);
        })
        getMensa();
    })    
}

$( document ).ready(function()
{
    getMensa();
})
