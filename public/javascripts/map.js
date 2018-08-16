'use strict';
/**
 * @file This script sets up the Leaflet map
 */
var geoJSONDrawn = "";

/* 
 * Setting up the two base layers.
 */
var mapboxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
var token = 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ';
var map = L.map('map').setView([51.963621,7.615891], 13); // the map with the start Coordinats
var streets = L.tileLayer(mapboxURL, {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: token
    }).addTo(map),
    satellite = L.tileLayer(mapboxURL, {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: token
    });

/*
 * Add fullscreen control.
 */
map.addControl(new L.Control.Fullscreen());

/* 
 * Add leaflet draw control features.
 */
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        circle: false

    }
}));

map.on('draw:created', function(e) {
    var type = e.layerType;
    var layer = e.layer;
    var currentGeojson = layer.toGeoJSON();
    
    if (geoJSONDrawn != ""){
      geoJSONDrawn.push(currentGeojson);
    }
    else {
      geoJSONDrawn = [currentGeojson];
    }

    $('button#delete').attr("disabled", false);
    $('button#download').attr("disabled", false);
    drawnItems.addLayer(layer);
});

/* 
 * Add the basemaps and overlays to the layercontrol.
 */
var baseMaps = {
    "Strassen": streets,
    "Satellit": satellite
};
var overlayMaps = {
    "Gezeichnete Sachen": drawnItems
} 
var lcontrol = L.control.layers(baseMaps, overlayMaps).addTo(map);