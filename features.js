"use strict";
var fs = require('fs');
var util = require('util');
var _ = require('lodash');

var geoJSON = require('geojson');

var features = fs.readFileSync('CA_Features_20140204.txt', 'utf-8').split('\r\n');
var properties = _.first(features).split('|');
features = _.rest(features);

_(features).map(function (feature) {
  return _.zipObject(properties, feature.split('|'));
}).groupBy('FEATURE_CLASS').each(function (features, groupName) {
  geoJSON.parse(features, {
    Point: ['PRIM_LAT_DEC', 'PRIM_LONG_DEC']
  }, function (geojson) {
    fs.writeFileSync(groupName + '.geojson', JSON.stringify(geojson));
  });
});
