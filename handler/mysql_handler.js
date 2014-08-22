var mysql = require("mysql");
var config = require('../core/configuration/index.js')

var pool = mysql.createPool(config().database);

//connection.query('USE xenix_doogoon_db');
exports.insertMember = function(socialId, nick, profileImageUrl, uuid, device, pushToken, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE doogoon_lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_INSERT_MEMBER("'+socialId+'", "'+nick+'", "'+profileImageUrl+'", "'+uuid+'", "'+device+'", "'+pushToken+'")', function(err, rows, fields) {
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


exports.setMemberDevice = function(memberIndex, uuid, device, pushToken){
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


exports.set_member_device = function(sid, xid, device, uuid, push_token){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL XSP_MEMBER_DEVICE_SET('+sid+', '+xid+', "'+uuid+'", "'+device+'", "'+push_token+'")', function(err, rows, fields) {
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


exports.set_service_member_level = function(sid, xid, level){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL XSP_SERVICE_MEMBER_LEVEL_SET('+sid+', '+xid+', '+level+')', function(err, rows, fields) {
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


exports.get_service_id = function(service_key, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('SELECT sid FROM x_service WHERE service_key = "' + service_key + '"', function(err, rows, fields) {
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


exports.get_member_regist_level = function(sid, xid, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL XSP_SERVICE_MEMBER_LEVEL_GET('+sid+', '+xid+')', function(err, rows, fields) {
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











///////////////// SERVICE /////////////////////////

exports.get_service_terms = function(sid, lang, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL XSP_SERVICE_TERMS_GET('+sid+', "'+lang+'")', function(err, rows, fields) {
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


exports.get_service_version = function(sid, device, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE xenix_service_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL XSP_SERVICE_VERSION_GET('+sid+', "'+device+'")', function(err, rows, fields) {
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
