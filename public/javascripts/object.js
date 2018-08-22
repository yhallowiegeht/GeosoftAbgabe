'use strict';

// create random map with leaflet and OSM
var drawnItems = new L.FeatureGroup();
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
    map = new L.Map('map', { center: new L.LatLng(51.9606649, 7.6261347), zoom: 13 }),
    drawnItems = L.featureGroup().addTo(map);
L.control.layers({ "OSM": osm.addTo(map)}).addTo(map);

// call function
loadGeomitriesOfObject();

/**
* function takes the geojson of the particular object and projects it on the map
*/
function loadGeomitriesOfObject() {
  // get geojson of object
  var json = document.getElementById("white").innerHTML;
  var geojson = JSON.parse(json);
  geojson = JSON.parse("" + geojson + "");
  var layer = L.geoJSON(geojson).addTo(map);
  map.fitBounds(layer.getBounds());
}
