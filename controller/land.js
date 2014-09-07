var when				= require('when'),
	_				= require('lodash'),
	config			= require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),
	mysql_manager	= require('../handler/mysql_handler'),
	redis_manager	= require('../handler/redis_handler'),
	mongodb_manager	= require('../handler/mongodb_handler'),
	token_manager	= require('../handler/token_handler'),
	team_manager	= require('../handler/team_handler'),
	push_manager	= require('../handler/push_handler'),
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
							var saveBulletUpdateTime = null;
							
							if(resArray.spearUpdateDate != undefined)
							{
								//var startDate = moment(resArray.spearUpdateDate).zone(-9);
								//var endDate = moment();
								
								var startDate = moment(resArray.spearUpdateDate).zone(-9);
								var endDate = moment();
								
								//var secondsDiff = endDate.diff(startDate, 'seconds');
								var secondsDiff = startDate.diff(endDate, 'seconds');
								console.log(startDate);
								console.log(endDate);
								console.log(secondsDiff);
								
								if(secondsDiff > 600)
								{
									var times = parseInt(10 * Math.floor(secondsDiff / 600));
									//console.log(times);
									saveBulletUpdateTime = startDate.add(times, 'minutes');
									console.log(saveBulletUpdateTime.format('YYYY-MM-DD HH:mm:ss'));
								}
								
								spearCount = resArray.spearCount + Math.floor(secondsDiff / 600);
								spearReaminTime = 600 - (secondsDiff % 600);
								
								if(spearCount >= 5)
								{
									spearCount = 5;
									spearReaminTime = 0;
								}
							}
							
							console.log(spearCount);
							
							if(spearCount > 0)
							{
								mysql_manager.setMemberLandConquer(memberIndex, landIndex, lat, lon, function(err, mysqlResult2){
									if(err)
									{
										resData.resultCode = 10;				
										resData.resultmessage = 'Mysql setMemberLandConquer() 오류';	
										
										response.json(500, resData);
									}
									else
									{
										if(spearCount == 5)
										{
											var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
											//console.log(currentDate);
											mysql_manager.updateSpearInfo(memberIndex, spearCount - 1, currentDate);
										}
										else
										{
											console.log(saveBulletUpdateTime);
											mysql_manager.updateSpearInfo(memberIndex, spearCount - 1, (saveBulletUpdateTime != null)?saveBulletUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null);
										}
										
										mongodb_manager.getLastConquerMemberIndex('conquer.log', landIndex, function(err, mongoResult){
											if(err)
											{
												resData.result = 10;
												resData.resultmessage = '서버 getLastConquerMemberIndex 오류';
												
												response.json(500, resData);
											}
											else
											{
												if(mongoResult.length > 0)
												{
													// 정복 당했습니다. 푸시 전송
													mysql_manager.getPushInfo(memberIndex, mongoResult[0].memberIndex, function(err, mysqlResult2) {
														if(err)
														{
															resData.resultCode = 10;				
															resData.resultmessage = 'Mysql getPushInfo() 오류';	
															
															response.json(500, resData);
														}
														else
														{
															var dbData2 = JSON.parse(mysqlResult2);
															
															push_manager.sendAPNS(dbData2[0].pushToken, '회원님의 땅이 '+dbData2[0].nickname+'님에게 정복당했습니다.', '');													
														}
														
													});
													
													
													// 정복 한 사람 업데이트
													mongodb_manager.updateConquerNextMemberIndex('conquer.log', memberIndex, mongoResult[0]._id, function(err, updateResult){
														if(err)
														{
															resData.result = 10;
															resData.resultmessage = '서버 updateConquerNextMemberIndex 오류';
															
															response.json(500, resData);
														}
														else
														{
															mongodb_manager.insertMemberConquerLog('conquer.log', memberIndex, landIndex, 0, lat, lon);
														}
													});
												}
												else
												{
													mongodb_manager.insertMemberConquerLog('conquer.log', memberIndex, landIndex, 0, lat, lon);
												}
											}
										});
										
										resData.resultCode = 1;
										resData.resultmessage = '성공';
										
										response.json(200, resData);
									}
								});
							}
							else
							{
								resData.resultCode = 16;				
								resData.resultmessage = '창이 없음';	
								
								response.json(400, resData);
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
	
	current : function current(response, body, options) {
		
		console.log('current');
		var resData = {};
		console.log(body);
		console.log(body.query.northWestLat);
		if(body.token != null && body.uuid != null && body.device != null && body.query.northWestLat != null && body.query.northWestLon != null && body.query.southEastLat != null && body.query.southEastLon != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var northWestLat = body.query.northWestLat;
			var northWestLon = body.query.northWestLon;
			var southEastLat = body.query.southEastLat;
			var southEastLon = body.query.southEastLon;
			
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
					
					mysql_manager.getCurrentDongList(northWestLat, northWestLon, southEastLat, southEastLon, function(err, mysqlResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getCurrentDongList 오류';
							
							response.json(500, resData);
						}
						else
						{
							var dbData = JSON.parse(mysqlResult);
							
							resData.resultCode = 1;
							resData.resultmessage = '성공';
							resData.data = dbData;
							
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
		
	}

};

module.exports = land;
