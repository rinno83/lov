var mongodb = require("mongodb");
var config = require('../core/configuration/index.js')

var MongoClient = require('mongodb').MongoClient;

exports.insertMemberConquerLog = function(collection_name, memberIndex, landIndex, nextConquerMemberIndex, lat, lon) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		var currentDate = new Date().getTime();
		db.collection(collection_name).insert({'memberIndex':memberIndex, 'landIndex':landIndex, 'nextConquerMemberIndex':nextConquerMemberIndex, 'lat':lat, 'lon':lon, 'registDate':currentDate}, function(err, result) {
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


exports.updateConquerNextMemberIndex = function(collection_name, memberIndex, mongoId, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		var currentDate = new Date().getTime();
		db.collection(collection_name).update({'_id':mongoId}, {'$set':{'nextConquerMemberIndex':memberIndex}}, {upsert:true}, function(err, result) {
			if(err)
			{
				throw err;
			}
			else
			{
				return fn(err, result);
				db.close();
			}			
		});
	});
};

exports.getLastConquerMemberIndex = function(collection_name, landIndex, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		var currentDate = new Date().getTime();
		db.collection(collection_name).find({'landIndex':landIndex}).sort([['registDate', -1]]).limit(1).toArray(function(err, result) {
			if(err)
			{
				throw err;
			}
			else
			{
				return fn(err, result);
				
				db.close();
			}			
		});

	});
};


exports.getMemberHistory = function(collection_name, memberIndex, offset, limit, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		var currentDate = new Date().getTime();
		db.collection(collection_name).find({'memberIndex':memberIndex}).sort([['registDate', -1]]).limit(limit).skip(offset).toArray(function(err, result) {
			if(err)
			{
				throw err;
			}
			else
			{
				return fn(err, result);
				
				db.close();
			}			
		});

	});
};



