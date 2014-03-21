"use strict";
var fs = require('fs');
var util = require('util');

var geoJSON = require('geojson');

var peaks = JSON.parse(fs.readFileSync('peaks.json', 'utf-8'));
peaks.forEach(function (peak) {
  peak.lat = parseFloat(peak.lat, 10);
  peak.lon = parseFloat(peak.lon, 10);
});

geoJSON.parse(peaks, {
  Point: ['lat', 'lon']
}, function (geojson) {
  console.log(util.inspect(geojson, {showHidden: true, depth: null}));
  fs.writeFileSync('peaks.geojson', JSON.stringify(geojson));
});


