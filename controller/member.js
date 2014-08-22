var when				= require('when'),
	_				= require('lodash'),
	config			= require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),
	mysql_manager	= require('../handler/mysql_handler'),
	redis_manager	= require('../handler/redis_handler'),
	mongodb_manager	= require('../handler/mongodb_handler'),
	token_manager	= require('../handler/token_handler'),
	methodOverride	= require("method-override"),
	querystring		= require("querystring"),
	path			= require("path"),
	http  			= require("http"),
	crypto 			= require("crypto"),
	member;
	

function get_member_token_key(device, token)
{
	return key_string = "TOKEN::"+device+"::"+token;
}

member = {

	social: function social(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.socialId != null && body.nickname != null && body.uuid != null && body.device != null)
		{
			socialId = body.socialId;
			nick = body.nickname;
			profileImageUrl = (body.profileImageUrl == undefined)?'':body.profileImageUrl;
			
			uuid = body.uuid;
			device = body.device;
			pushToken = (body.pushToken == undefined)?'':body.pushToken;
			
			mysql_manager.insertMember(socialId, nick, profileImageUrl, uuid, device, pushToken, function(err, data){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					var dbData = JSON.parse(data);
					
					if(dbData[0].result == 1)
					{
						// Set Member Device in Mysql
						mysql_manager.setMemberDevice(dbData[0].memberIndex, uuid, device, pushToken);
						
						var member_token = token_manager.make_member_token(dbData[0].memberIndex, device, uuid);
						console.log('member_token : ' + member_token);
						
						// Set Member Token in Redis
						var redis_key = get_member_token_key(device, member_token);
						
						var redis_instance = new redis_manager(config().redis);
						redis_instance.set(redis_key, dbData[0].memberIndex, function(err, reply){});
						
						
						// Response
						var resArray = {
							'token':member_token
						};
						resData.resultmessage = '가입 성공';
						resData.data = resArray;
						
						response.json(200, resData);						
					}
					else if(dbData[0].result == 2)
					{
						var resArray = dbData[0];
						
						resData.resultmessage = '로그인 성공';
						resData.data = resArray;
						
						response.json(200, resData);
					}
					else
					{
						resData.result = '01';
						resData.resultmessage = 'DB 오류';
						
						response.json(500, resData);
					}
					
					
				}
			});
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	token: function token(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			resData.resultCode = 1;
			resData.resultmessage = '성공';
			
			response.json(200, resData);
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	friend_sync: function friend_sync(response, body, options) {
		
		//console.log('login');
		var resData = {};
		console.log(body);
		
		if(body.token != null && body.uuid != null && body.device != null && body.friends != null)
		{
			resData.resultCode = 1;
			resData.resultmessage = '성공';
			
			response.json(200, resData);
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	info: function info(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var resArray = {
				'nickname':'doogoon',
				'profileImageUrl':'http://image.tvdaily.co.kr/upimages/gisaimg/201203/1330754784_281586.jpg',
				'teamName':'blue',
				'teamImageUrl':'http://rlv.zcache.com/team_blue_polka_dot_stars_round_sticker-p217941021613239303en8ct_265.jpg'
			};
			resData.resultCode = 1;
			resData.resultmessage = '성공';
			resData.data = resArray;
			
			response.json(200, resData);
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	info_update: function info_update(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var resArray = {
				'nickname':'doogoon',
				'profileImageUrl':'http://image.tvdaily.co.kr/upimages/gisaimg/201203/1330754784_281586.jpg',
				'teamName':'blue',
				'teamImageUrl':'http://rlv.zcache.com/team_blue_polka_dot_stars_round_sticker-p217941021613239303en8ct_265.jpg'
			};
			resData.resultCode = 1;
			resData.resultmessage = '성공';
			resData.data = resArray;
			
			response.json(200, resData);
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	logout: function logout(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			resData.resultCode = 1;
			resData.resultmessage = '성공';
			
			response.json(200, resData);
		}
		else {
			resData.result = '02';
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	}

};

module.exports = member;
