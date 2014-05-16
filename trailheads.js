"use strict";
var fs = require('fs');
var util = require('util');
var _ = require('lodash');
var request = require('request');
var q = require('q');

var xmldom = require('xmldom');
var geoJSON = require('geojson');
var togeojson = require('togeojson');

var gpxs = fs.readFileSync('raw/waypoints.txt', 'utf-8').trim().split('\n');
console.log(gpxs);

var waypoints = _.map(gpxs, function (url) {
  var deferred = q.defer();
  request(url, function(err, response, body) {
    if (err) {
      return deferred.reject(new Error(err));
    }
    try {
      var dom  = new xmldom.DOMParser().parseFromString(body, 'text/xml');
      console.log('parsed', url, 'into xml dom');
      deferred.resolve(dom);
    } catch (e) {
      console.log('xml parse threw', e);
    }
  });

  return deferred.promise;
});

q.all(waypoints)
.then(function (results) {
  return _.map(results, function (gpx) {
    return togeojson.gpx(gpx);
  });
})
.then(function (geojsons) {
  var trailheads = _(geojsons).pluck('features').flatten().filter(function (feature) {
    return (feature.properties.desc.indexOf('TRAILHEAD') >= 0);
  }).valueOf();

  var trailheadCollection = {
    type: 'FeatureCollection',
    features: trailheads
  };

  var fName = 'geojson/trailheads.geojson';
  fs.writeFileSync(fName , JSON.stringify(trailheadCollection, null, true));
  console.log('wrote', fName);
}, function () {
  console.error('failed');
});
