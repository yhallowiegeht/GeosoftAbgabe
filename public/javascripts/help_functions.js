
var linkDate;

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