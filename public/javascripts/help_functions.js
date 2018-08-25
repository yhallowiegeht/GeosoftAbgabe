
var linkDate;

/**
*@desc Helper function, removes element it's invoked by from DOM
*/
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

/*
 * Simple function to estimate the mean coordinate value
 * of a polygon like the inputs from institutes 
 */ 
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
/*
 * Function to get the time
 */ 
function getCurrentTime(){
    var date = new Date();
    date.setHours(date.getHours() + 2);
    var year = date.getFullYear().toString();
    if (date.getMonth() < 9){
        var month = "0"+(date.getMonth()+1).toString();
    } else {
        var month = (date.getMonth()+1).toString();
    }
    var day = date.getDate().toString();
    linkDate = year+"-"+month+"-"+day;
}

/*
 * Error-handler
 */ 
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
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
    catch (err) {
        alert("Nix zu loeschn");
    }
})
/*
 * distance function from first assignment
 * Credit to https://stackoverflow.com/users/1090562/salvador-dali
 */ 
function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}