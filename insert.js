var fs  = require('fs');
var Q = require('q');
var MongoClient = require('mongodb').MongoClient;

var dbConnection;

function insertPeaks(peaks, conn) {
	dbConnection = conn;
	var collection = conn.collection('peaks');
	return Q.ninvoke(collection, 'insert', peaks, {safe: true});
}

var peaksPromise = Q.nfcall(fs.readFile, 'peaks.json').then(function (file) {
	return JSON.parse(file);
});
var dbPromise = Q.nfcall(MongoClient.connect, 'mongodb://127.0.0.1:27017/sps'); 

Q.all([peaksPromise, dbPromise]).spread(insertPeaks).done(function() {
	if (dbConnection) {
		dbConnection.close();
	}
});
