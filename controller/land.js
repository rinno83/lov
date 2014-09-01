var when				= require('when'),
	_				= require('lodash'),
	config			= require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),
	mysql_manager	= require('../handler/mysql_handler'),
	redis_manager	= require('../handler/redis_handler'),
	mongodb_manager	= require('../handler/mongodb_handler'),
	token_manager	= require('../handler/token_handler'),
	team_manager	= require('../handler/team_handler'),
	methodOverride	= require("method-override"),
	querystring		= require("querystring"),
	path			= require("path"),
	http  			= require("http"),
	crypto 			= require("crypto"),
	dateformat 		= require("dateformat"),
	moment 			= require('moment'),
	land;
	

function get_member_token_key(device, token)
{
	return key_string = "TOKEN::"+device+"::"+token;
}

land = {

	conquer : function conquer(response, body, options) {
		
		console.log('conquer');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.landIndex != null && body.lat != null && body.lon != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var landIndex = body.landIndex;
			var lat = body.lat;
			var lon = body.lon;
			
			var redisKey = util.getMemberTokenKey(device, token);
			var redisInstance = new redis_manager(config().redis);
			redisInstance.get(redisKey, function(err, reply){
				if(err || reply == null)
				{
					resData.result = 13;
					resData.resultmessage = '회원 없음';
					
					response.json(400, resData);
				}
				else
				{
					var memberIndex = reply;
					console.log(memberIndex);
					mysql_manager.setMemberLandConquer(memberIndex, landIndex, lat, lon);
					
					mongodb_manager.insertMemberConquerLog('conquer.log', memberIndex, landIndex, lat, lon);
					
					resData.resultCode = 1;
					resData.resultmessage = '성공';
					
					response.json(200, resData);
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	}

};

module.exports = land;
