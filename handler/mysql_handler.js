var mysql = require("mysql");
var config = require('../core/configuration/index.js')

var pool = mysql.createPool(config().database);

//connection.query('USE xenix_doogoon_db');
exports.insertMember = function(socialId, nick, profileImageUrl, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_INSERT_MEMBER("'+socialId+'", "'+nick+'", "'+profileImageUrl+'")', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};


exports.updateMemberInfo = function(memberIndex, nick, profileImageUrl, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_UPDATE_MEMBER_INFO('+memberIndex+', "'+nick+'", "'+profileImageUrl+'")', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};


exports.setMemberDevice = function(memberIndex, uuid, device, pushToken, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_DEVICE('+memberIndex+', "'+uuid+'", "'+device+'", "'+pushToken+'")', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};


exports.getMemberInfo = function(memberIndex, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_MEMBER_INFO('+memberIndex+')', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};


exports.upsertMemberFriends = function(memberIndex, friends, friendType){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('REPLACE INTO tb_member_friend(memberIndex, friendIndex) SELECT '+memberIndex+' AS memberIndex, memberIndex AS friendIndex FROM tb_member WHERE socialId IN ( '+friends+' );', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
			    	console.log(err);
				    throw err;
			    }
			});
						    
		});
	});
};







exports.setMemberLandConquer = function(memberIndex, landIndex, lat, lon){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_LAND_CONQUER('+memberIndex+', '+landIndex+', '+lat+', '+lon+')', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			});
						    
		});
	});
};







exports.getServiceVersion = function(serviceIndex, device, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_SERVICE_VERSION('+serviceIndex+', "'+device+'")', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};


exports.getTeamInfo = function(fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_TEAM_INFO()', function(err, rows, fields) {
				// And done with the connection.
				connection.release();
		
			    // Don't use the connection here, it has been returned to the pool.
			    if(err)
			    {
				    throw err;
			    }
			    else
			    {
				    return fn(err, JSON.stringify(rows[0]));
			    }
			});
						    
		});
	});
};