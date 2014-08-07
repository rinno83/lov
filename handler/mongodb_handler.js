var mongodb = require("mongodb");
var config = require('../core/configuration/index.js')

var MongoClient = require('mongodb').MongoClient;

exports.set_member_info = function(collection_name, xid, info) {
	MongoClient.connect(config().mongodb.url, function(err, db) {

		db.collection(collection_name).update({'xid':xid}, {'xid':xid, 'info':info}, {upsert:true}, function(err, result) {
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


exports.set_member_profile = function(collection_name, xid, profile, thumbnail) {
	MongoClient.connect(config().mongodb.url, function(err, db) {

		db.collection(collection_name).update({'xid':xid}, {'xid':xid, 'profile_url':profile, 'thumbnail_url':thumbnail}, {upsert:true}, function(err, result) {
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



exports.get_member_profile = function(collection_name, xid, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {

		db.collection(collection_name).find({'xid':xid}).toArray(function(err, result) {
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
