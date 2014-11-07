var mongodb 		= require("mongodb"),
	moment 			= require('moment'),
	ObjectId 		= require('mongodb').ObjectID;

var config = require('../core/configuration/index.js')

var MongoClient = require('mongodb').MongoClient;

exports.insertMemberConquerLog = function(collection_name, memberIndex, landIndex, nextConquerMemberIndex) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		console.log(moment().format('X'));
		var currentDate = moment().format('X');
		db.collection(collection_name).insert({'memberIndex':memberIndex, 'landIndex':landIndex, 'nextConquerMemberIndex':nextConquerMemberIndex, 'registDate':currentDate}, function(err, result) {
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



exports.getMemberWalkGatheringLog = function(collection_name, memberIndex, mongoId, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		var currentDate = new Date().getTime();
		db.collection(collection_name).find({'memberIndex':memberIndex, '_id':new ObjectId(mongoId)}).toArray(function(err, result) {
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


exports.insertMemberWalkGatheringLog = function(collection_name, memberIndex, lat, lon, money, updateDate, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		db.collection(collection_name).insert({'memberIndex':memberIndex, 'location':[{'lat':lat, 'lon':lon, 'updateDate':updateDate}], 'money':money}, function(err, result) {
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


exports.updateMemberWalkGatheringLog = function(collection_name, memberIndex, mongoId, lat, lon, money, updateDate) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		db.collection(collection_name).update({'memberIndex':memberIndex, '_id':mongoId}, {'$push':{'location':{'$each':[{'lat':lat, 'lon':lon, 'updateDate':updateDate}]}}, '$set':{'money':money}}, {upsert:true}, function(err, result) {
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




exports.delMemberConquerLog = function(collection_name, fn) {
	MongoClient.connect(config().mongodb.url, function(err, db) {
		
		db.collection(collection_name).remove(function(err, result) {
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



