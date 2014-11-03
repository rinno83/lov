var mysql = require("mysql");
var config = require('../core/configuration/index.js');

var pool = mysql.createPool(config().database);

//connection.query('USE xenix_doogoon_db');
exports.insertMember = function(socialId, nick, profileImageUrl, introduce, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_INSERT_MEMBER("'+socialId+'", "'+nick+'", "'+profileImageUrl+'", "'+introduce+'")', function(err, rows, fields) {
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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







exports.setMemberLandConquer = function(memberIndex, landIndex, lat, lon, investMoney, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_LAND_CONQUER('+memberIndex+', '+landIndex+', '+lat+', '+lon+', '+investMoney+')', function(err, rows, fields) {
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






exports.setMemberMoney = function(memberIndex, totalInvestMoney, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_MONEY('+memberIndex+', '+totalInvestMoney+')', function(err, rows, fields) {
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


exports.setMemberGatheringMoney = function(memberIndex, gatheringMoney, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_GATHERING_MONEY('+memberIndex+', '+gatheringMoney+')', function(err, rows, fields) {
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


exports.setMemberTeam = function(memberIndex, teamIndex){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_TEAM('+memberIndex+', '+teamIndex+')', function(err, rows, fields) {
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


exports.initMemberTeam = function(){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_INIT_MEMBER_TEAM()', function(err, rows, fields) {
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


exports.updateSpearInfo = function(memberIndex, spearCount, spearUpdateDate){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_UPDATE_SPEAR_INFO('+memberIndex+', '+spearCount+', "'+spearUpdateDate+'")', function(err, rows, fields) {
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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
		
		connection.query('USE lov_db', function(err, rows, fields){
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


exports.getMemberPushToken = function(memberIndex, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_MEMBER_PUSHTOKEN('+memberIndex+')', function(err, rows, fields) {
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



exports.setMemberToken = function(memberIndex, memberToken){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_MEMBER_TOKEN('+memberIndex+', "'+memberToken+'")', function(err, rows, fields) {
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


exports.getMemberRank = function(offset, limit, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_MEMBER_RANK('+offset+', '+limit+')', function(err, rows, fields) {
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


exports.getTeamMemberRank = function(memberIndex, offset, limit, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_TEAM_MEMBER_RANK('+memberIndex+', '+offset+', '+limit+')', function(err, rows, fields) {
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


exports.getCurrentDongList = function(northWestLat, northWestLon, southEastLat, southEastLon, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_CURRENT_DONG_LIST('+northWestLat+', '+northWestLon+', '+southEastLat+', '+southEastLon+')', function(err, rows, fields) {
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



exports.getCurrentDong = function(landIndex, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_CURRENT_DONG('+northWestLat+', '+northWestLon+', '+southEastLat+', '+southEastLon+')', function(err, rows, fields) {
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




exports.getPushInfo = function(memberIndex, conqueredMemberIndex, fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_GET_CONQUER_INFO('+memberIndex+', '+conqueredMemberIndex+')', function(err, rows, fields) {
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

exports.setItemWinner = function(fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_SET_ITEM_WINNER()', function(err, rows, fields) {
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





exports.delMemberTeam = function(fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_DEL_MEMBER_TEAM()', function(err, rows, fields) {
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


exports.initMemberTeam = function(fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_INIT_MEMBER_TEAM()', function(err, rows, fields) {
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


exports.delMemberConquer = function(fn){
	pool.getConnection(function(err, connection) {
		if(err)
		{
			throw err;
		}
		
		connection.query('USE lov_db', function(err, rows, fields){
			// Use the connection
			connection.query('CALL USP_DEL_MEMBER_CONQUER()', function(err, rows, fields) {
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