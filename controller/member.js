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
		console.log('login!!');
		console.log(body);
		console.log(options);
		var resData = {};
		
		if(body.socialId != null && body.nickname != null && body.uuid != null && body.device != null)
		{
			socialId = body.socialId;
			nick = body.nickname;
			profileImageUrl = (body.profileImageUrl == undefined)?'':body.profileImageUrl;
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
								
								// Set Member token in Mysql
								mysql_manager.setMemberToken(memberIndex, memberToken);
								
								// Set Team
								mysql_manager.getTeamInfo(function(err, teamResult){
									if(err)
									{
										resData.resultCode = 10;				
										resData.resultmessage = 'Mysql getTeamInfo() 오류';	
										
										response.json(500, resData);
									}
									else
									{
										var dbResult = JSON.parse(teamResult);
									
										var blueTeam = dbResult[0];
										var whiteTeam = dbResult[1];
										
										console.log(blueTeam.teamMemberCount);
										console.log(whiteTeam.teamMemberCount);
										
										if(blueTeam.teamConquerCount > whiteTeam.teamConquerCount)
										{
											if(blueTeam.teamMemberCount > whiteTeam.teamMemberCount)
											{
												mysql_manager.setMemberTeam(memberIndex, whiteTeam.teamIndex);
											}
											else
											{
												var blueTeamMinimumMemberCount = parseInt((3 * whiteTeam.teamMemberCount) / 7);
												
												if(blueTeam.teamMemberCount > blueTeamMinimumMemberCount)
												{
													mysql_manager.setMemberTeam(memberIndex, whiteTeam.teamIndex);
												}
												else
												{
													mysql_manager.setMemberTeam(memberIndex, blueTeam.teamIndex);
												}
												
											}
										}
										else
										{
											if(blueTeam.teamMemberCount > whiteTeam.teamMemberCount)
											{	
												var whiteTeamMinimumMemberCount = parseInt((3 * blueTeam.teamMemberCount) / 7);
												
												if(whiteTeam.teamMemberCount > whiteTeamMinimumMemberCount)
												{
													mysql_manager.setMemberTeam(memberIndex, blueTeam.teamIndex);
												}
												else
												{
													mysql_manager.setMemberTeam(memberIndex, whiteTeam.teamIndex);
												}
											}
											else
											{
												mysql_manager.setMemberTeam(memberIndex, blueTeam.teamIndex);
											}
										}
									}
								});
								
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
								// Get Member Token
								var memberToken = token_manager.makeMemberToken(memberIndex, device, uuid);
								console.log('memberToken : ' + memberToken);
								
								// Set Member Token in Redis
								var redisKey = util.getMemberTokenKey(device, memberToken);
								
								var redisInstance = new redis_manager(config().redis);
								redisInstance.set(redisKey, memberIndex, function(err, reply){});
								
								// Set Member token in Mysql
								mysql_manager.setMemberToken(memberIndex, memberToken);
								
								var resArray = {
									'token':memberToken
								};
								
								resData.resultmessage = '로그인 성공';
								resData.data = resArray;
								
								response.json(200, resData);
							}
						});						
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
		
		console.log('token check!!');
		console.log(body);
		console.log(options);
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
	
	
	info: function info(response, body, options) {
		
		console.log('get member info!!');
		console.log(body);
		console.log(options);
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
					
					console.log(memberIndex);
					
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
					var memberIndex = reply;
					
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
					var redisInstance2 = new redis_manager(config().redis);
					redisInstance2.del(redisKey, function(err, reply) {
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
	
	
	
	moneyWalkGatheringStart: function moneyWalkGathering(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.lat != null && body.lon != null && body.updateDate != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var lat = body.lat;
			var lon = body.lon;
			var money = 0;
			var updateDate = body.updateDate;
			
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
					mongodb_manager.insertMemberWalkGatheringLog('gatheringMoney.log', memberIndex, lat, lon, money, updateDate, function(err, insertMemberWalkGatheringLogResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 insertMemberWalkGatheringLog() 오류';
							
							response.json(400, resData);
						}
						else
						{
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							resData.data = {
								gatheringKey: insertMemberWalkGatheringLogResult[0]._id,
								money: 0
							};
							
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
	
	moneyWalkGathering: function moneyWalkGathering(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.gatheringKey != null && body.lat != null && body.lon != null && body.updateDate != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var gatheringKey = body.gatheringKey;
			var lat = body.lat;
			var lon = body.lon;
			var updateDate = body.updateDate;
			
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
					console.log(gatheringKey);
					
					mongodb_manager.getMemberWalkGatheringLog('gatheringMoney.log', memberIndex, gatheringKey, function(err, mongoResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getMemberHistory() 오류';
							
							response.json(400, resData);
						}
						else
						{
							var c = new Date(updateDate);
							var u = new Date(mongoResult[0].location[mongoResult[0].location.length - 1].updateDate);
							
							var second = (c - u) / 1000;
							
							if(second > 60)
							{
								resData.result = 15;
								resData.resultmessage = '1분 이상 위치 신호를 받지 못했습니다.';
								resData.data = {
									gatheringKey: mongoResult[0]._id,
									money: mongoResult[0].money
								};
								
								response.json(400, resData);
							}
							else
							{
								var distance = util.getMeter(mongoResult[0].location[mongoResult[0].location.length - 1].lat, mongoResult[0].location[mongoResult[0].location.length - 1].lon, lat, lon);
								var money = (distance * 10) + mongoResult[0].money;

								mongodb_manager.updateMemberWalkGatheringLog('gatheringMoney.log', memberIndex, mongoResult[0]._id, lat, lon, money, updateDate);
								
								resData.resultCode = 1;
								resData.resultmessage = '성공';
								resData.data = {
									gatheringKey: mongoResult[0]._id,
									money: money
								};
								
								response.json(200, resData);	
							}
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
	
	
	moneyWalkGatheringEnd: function moneyWalkGathering(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.gatheringKey != null && body.lat != null && body.lon != null && body.updateDate != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var gatheringKey = body.gatheringKey;
			var lat = body.lat;
			var lon = body.lon;
			var updateDate = body.updateDate;
			
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
					console.log(gatheringKey);
					
					mongodb_manager.getMemberWalkGatheringLog('gatheringMoney.log', memberIndex, gatheringKey, function(err, mongoResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getMemberHistory() 오류';
							
							response.json(400, resData);
						}
						else
						{
							var currentDate = new Date().getTime();
							var c = new Date(currentDate);
							var u = new Date(mongoResult[0].location[mongoResult[0].location.length - 1].updateDate);
							
							var second = (c - u) / 1000;
							
							if(second > 60)
							{
								resData.result = 15;
								resData.resultmessage = '1분 이상 위치 신호를 받지 못했습니다.';
								resData.data = {
									gatheringKey: mongoResult[0]._id,
									money: mongoResult[0].money
								};
								
								response.json(400, resData);
							}
							else
							{
								var distance = util.getMeter(mongoResult[0].location[mongoResult[0].location.length - 1].lat, mongoResult[0].location[mongoResult[0].location.length - 1].lon, lat, lon);
								var money = (distance * 10) + mongoResult[0].money;

								mysql_manager.setMemberGatheringMoney(memberIndex, money, function(err, mysqlResult){
									if(err)
									{
										resData.result = 10;
										resData.resultmessage = '서버 setMemberGatheringMoney() 오류';
										
										response.json(400, resData);
									}
									else
									{
										mongodb_manager.updateMemberWalkGatheringLog('gatheringMoney.log', memberIndex, mongoResult[0]._id, lat, lon, money);
								
										resData.resultCode = 1;
										resData.resultmessage = '성공';
										resData.data = {
											gatheringKey: mongoResult[0]._id,
											money: money
										};
										
										response.json(200, resData);
									}
								});									
							}
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
		
	}

};


module.exports = member;
