var when				= require('when'),
	_				= require('lodash'),
	config			= require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),
	mysql_manager	= require('../handler/mysql_handler'),
	redis_manager	= require('../handler/redis_handler'),
	mongodb_manager	= require('../handler/mongodb_handler'),
	token_manager	= require('../handler/token_handler'),
	team			= require('./team'),
	methodOverride	= require("method-override"),
	querystring		= require("querystring"),
	path			= require("path"),
	http  			= require("http"),
	crypto 			= require("crypto"),
	dateformat 		= require("dateformat"),
	moment 			= require('moment'),
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
			friends = (body.friends == undefined)?'':body.friends;
			friendType = 'facebook';
			introduce = '안녕하세요. '+nick+'입니다.';
						
			uuid = body.uuid;
			device = body.device;
			pushToken = (body.pushToken == undefined)?'':body.pushToken;

			
			mysql_manager.insertMember(socialId, nick, profileImageUrl, introduce, function(err, data){
				if(err)
				{
					resData.resultCode = 10;				
					resData.resultmessage = 'Mysql insertMember() 오류';	
					
					response.json(500, resData);
				}
				else
				{
					var dbData = JSON.parse(data);
					console.log(dbData);
					
					memberIndex = dbData[0].memberIndex;
					
					// Set Member Friends
					if(friends != '')
					{
						friendsArray = friends.split(',');
						friendsString = '';
						for(var i=0;i<friendsArray.length;i++)
						{
							if(i == 0)
							{
								friendsString += "'" + friendsArray[i] + "'";
							}
							else
							{
								friendsString += ",'" + friendsArray[i] + "'";
							}
						}
						console.log('friendsString => ' + friendsString);
						mysql_manager.upsertMemberFriends(memberIndex, friendsString, friendType);	
					}
					
					if(dbData[0].result == 1) // join
					{
						// Set Member Device in Mysql
						mysql_manager.setMemberDevice(memberIndex, uuid, device, pushToken, function(err, mysqlResult) {
							if(err)
							{
								resData.resultCode = 10;				
								resData.resultmessage = 'Mysql setMemberDevice() 오류';	
								
								response.json(500, resData);		
							}
							else
							{
								var memberToken = token_manager.makeMemberToken(memberIndex, device, uuid);
								console.log('memberToken : ' + memberToken);
								
								// Set Member Token in Redis
								var redisKey = util.getMemberTokenKey(device, memberToken);
								
								var redisInstance = new redis_manager(config().redis);
								redisInstance.set(redisKey, memberIndex, function(err, reply){});
								
								// Set Team
								mysql_manager.setMemberTeam(memberIndex);
								
								
								// Response
								var resArray = {
									'token':memberToken
								};
								resData.resultmessage = '가입 성공';
								resData.data = resArray;
								
								response.json(200, resData);	
							}
						});						
					}
					else if(dbData[0].result == 2) // login
					{
						// Get Member Token
						var memberToken = token_manager.makeMemberToken(memberIndex, device, uuid);
						console.log('memberToken : ' + memberToken);
						
						// Set Member Token in Redis
						var redisKey = util.getMemberTokenKey(device, memberToken);
						
						var redisInstance = new redis_manager(config().redis);
						redisInstance.set(redisKey, memberIndex, function(err, reply){});
						
						var resArray = {
							'token':memberToken
						};
						
						resData.resultmessage = '로그인 성공';
						resData.data = resArray;
						
						response.json(200, resData);
					}
					else
					{
						resData.result = 10;
						resData.resultmessage = 'DB 오류';
						
						response.json(500, resData);
					}
					
					
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	token: function token(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
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
		
	},
	
	friend_sync: function friend_sync(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.friends != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var friends = body.friends;
			var friendType = 'facebook';
			
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
					
					friendsArray = friends.split(',');
					friendsString = '';
					for(var i=0;i<friendsArray.length;i++)
					{
						if(i == 0)
						{
							friendsString += "'" + friendsArray[i] + "'";
						}
						else
						{
							friendsString += ",'" + friendsArray[i] + "'";
						}
					}
					console.log('friendsString => ' + friendsString);
					mysql_manager.upsertMemberFriends(memberIndex, friendsString, friendType);	
					
					resData.resultCode = 1;
					resData.resultmessage = '성공';
					
					response.json(200, resData);
				}
			});
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
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
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
					var memberIndex = (body.memberIndex != null)?body.memberIndex:reply;
					
					mysql_manager.getMemberInfo(memberIndex, function(err, mysqlResult) {
						if(err)
						{
							resData.resultCode = 10;				
							resData.resultmessage = 'Mysql getMemberInfo() 오류';	
							
							response.json(500, resData);
						}
						else
						{
							var dbData = JSON.parse(mysqlResult);
							
							console.log(dbData);
							
							var resArray = dbData[0];
							var spearCount = 5;
							var	spearReaminTime = 0;
							
							if(resArray.spearUpdateDate != undefined)
							{
								var startDate = moment(resArray.spearUpdateDate).zone(-9);;
								var endDate = moment();
								var secondsDiff = endDate.diff(startDate, 'seconds');
								
								spearCount = resArray.spearCount + Math.floor(secondsDiff / 600);
								spearReaminTime = 600 - (secondsDiff % 600);
								
								if(spearCount >= 5)
								{
									spearCount = 5;
									spearReaminTime = 0;
								}
							}
							
							resArray.spearCount = spearCount;
							resArray.spearRemainTime = spearReaminTime;
							resArray.spearUpdateDate = dateformat(resArray.spearUpdateDate, 'yyyy-mm-dd HH:MM:ss');
							
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
						
					});
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	info_update: function info_update(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.nickname != null && body.profileImageUrl != null && body.pushToken != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device
			
			var nickname = body.nickname;
			var profileImageUrl = body.profileImageUrl;
			var pushToken = body.pushToken;
			
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
					mysql_manager.updateMemberInfo(memberIndex, nickname, profileImageUrl, function(err, mysqlResult) {
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 setMemberDevice 오류';
							
							response.json(500, resData);
						}
						else
						{
							mysql_manager.setMemberDevice(memberIndex, uuid, device, pushToken, function(err, mysqlResult) {
								if(err)
								{
									resData.result = 10;
									resData.resultmessage = '서버 setMemberDevice 오류';
									
									response.json(500, resData);
								}
								else
								{
									mysql_manager.getMemberInfo(memberIndex, function(err, mysqlResult) {
									if(err)
									{
										resData.resultCode = 10;				
										resData.resultmessage = 'Mysql getMemberInfo() 오류';	
										
										response.json(500, resData);
									}
									else
									{
										var dbData = JSON.parse(mysqlResult);
										
										var resArray = dbData[0];
									
										var startDate = moment(resArray.spearUpdateDate, 'YYYY-M-DD HH:mm:ss');
										var endDate = moment();
										var secondsDiff = endDate.diff(startDate, 'seconds');
										
										var spearCount = resArray.spearCount + Math.floor(secondsDiff / 600);
										var spearReaminTime = 600 - (secondsDiff % 600);
										
										if(spearCount >= 5)
										{
											spearCount = 5;
											spearReaminTime = 0;
										}
										
										resArray.spearCount = spearCount;
										resArray.spearRemainTime = spearReaminTime;
										
										delete resArray.spearUpdateDate;
										
										resData.resultCode = 1;
										resData.resultmessage = '성공';
										resData.data = resArray;
										
										response.json(200, resData);
									}
									
								});
								}
							});
						}
					});
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	logout: function logout(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
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
					redisInstance.del(redisKey, function(err, reply) {
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 redis del() 오류';
							
							response.json(400, resData);
						}
						else
						{
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							
							response.json(200, resData);	
						}
					});
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	rank: function rank(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var offset = (body.offset == undefined)?0:body.offset;
			var limit = (body.limit == undefined)?10:body.limit;
			
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
					mysql_manager.getMemberRank(offset, limit, function(err, mysqlResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getMemberRank() 오류';
							
							response.json(400, resData);
						}
						else
						{
							var dbData = JSON.parse(mysqlResult);
							
							var resArray = dbData;
									
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
							
						}
					});
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	
	history: function history(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var offset = (body.offset == undefined)?0:body.offset;
			var limit = (body.limit == undefined)?20:body.limit;
			
			console.log(body.offset);
			console.log(limit);
			
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
					mongodb_manager.getMemberHistory('conquer.log', memberIndex, offset, limit, function(err, mongoResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getMemberHistory() 오류';
							
							response.json(400, resData);
						}
						else
						{
							var dbData = mongoResult;
							
							var resArray = dbData;
							
							for(var i in resArray)
							{
								delete resArray[i]._id;	
								delete resArray[i].memberIndex;	
							}
									
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
					});
				}
			});
		}
		else {
			resData.result = 11;
			resData.resultmessage = '파라메터 오류';
			
			response.json(400, resData);
		}
		
	},
	
	code: function code(response, body, options) {
		
		//console.log('login');
		var n = 5;
		var array = [
			[0, 1, 2, 0, 0],
			[0, 0, 0, 1, 0],
			[0, 1, 0, 1, 0],
			[0, 0, 2, 1, 0],
			[2, 1, 0, 0, 0],
		];
		
		console.log(array[0][0]);
		var me = 9999;
		
		for(var i=0; i<n; i++)
		{
			for(var j=0; j<n; j++)
			{
				
			}
		}
		
		response.json(200, array);
	}

};

module.exports = member;
