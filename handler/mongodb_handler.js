var mongodb = require("mongodb");
var config = require('../core/configuration/index.js')

var MongoClient = require('mongodb').MongoClient;

var currentDate = new Date().getTime();

exports.insertMemberConquerLog = function(collection_name, memberIndex, landIndex, lat, lon) {
	MongoClient.connect(config().mongodb.url, function(err, db) {

		db.collection(collection_name).insert({'memberIndex':memberIndex, 'landIndex':landIndex, 'lat':lat, 'lon':lon, 'registDate':currentDate}, function(err, result) {
			if(err)
			{
				throw err;
			}
			else
			{
				db.close();
			}			
		});
	});
};

