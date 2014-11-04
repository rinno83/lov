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
	timer			= null,
	job				= null,
	land;
	

function get_member_token_key(device, token)
{
	return key_string = "TOKEN::"+device+"::"+token;
}




land = {

	conquer : function conquer(response, body, options) {
		
		console.log('conquer');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.landIndex != null && body.lat != null && body.lon != null && body.investMoney != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var landIndex = body.landIndex;
			var lat = body.lat;
			var lon = body.lon;
			var investMoney = parseInt(body.investMoney);
			var battingMoney = 100;
			
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
					
					// 사용자 정보 가져오기
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
							
							if(resArray.money <= battingMoney)
							{
								resData.resultCode = 16;				
								resData.resultmessage = '투자할 금액이 부족합니다.';
								
								response.json(400, resData);
							}
							else
							{
								// 사용자 땅 정복 저장
								mysql_manager.setMemberLandConquer(memberIndex, landIndex, lat, lon, investMoney, function(err, mysqlResult2){
									if(err)
									{
										resData.resultCode = 10;				
										resData.resultmessage = 'Mysql setMemberLandConquer() 오류';	
										
										response.json(500, resData);
									}
									else
									{
										var dbData3 = JSON.parse(mysqlResult2);
										
										if(dbData3[0].result == 3)
										{
											resData.resultCode = 10;				
											resData.resultmessage = '내 땅입니다.';	
											
											response.json(400, resData);
										}
										else if(dbData3[0].result == 2)
										{
											mysql_manager.setMemberMoney(memberIndex, battingMoney, function(err, mysqlResult3){
												if(err)
												{
													resData.resultCode = 10;				
													resData.resultmessage = 'Mysql setMemberMoney() 오류';	
													
													response.json(500, resData);
												}
												else
												{
													resData.resultCode = 17;				
													resData.resultmessage = '현 시세보다 투자한 금액이 적습니다.';
													
													response.json(400, resData);
												}												
											});											
										}
										else
										{	
											var totalInvestMoney = investMoney + battingMoney;
											console.log('totalInvestMoney : ' + totalInvestMoney);
											
											// 사용자 돈 업데이트
											mysql_manager.setMemberMoney(memberIndex, totalInvestMoney, function(err, mysqlResult3){
												if(err)
												{
													resData.resultCode = 10;				
													resData.resultmessage = 'Mysql setMemberMoney() 오류';	
													
													response.json(500, resData);
												}
												else
												{
													var dbData4 = JSON.parse(mysqlResult3);
													var balance = dbData4[0].balance; // 잔액
													
													// 해당 땅을 가장 최근에 먹었던 사용자 가져오기
													mongodb_manager.getLastConquerMemberIndex('conquer.log', landIndex, function(err, mongoResult){
													if(err)
													{
														resData.result = 10;
														resData.resultmessage = '서버 getLastConquerMemberIndex 오류';
														
														response.json(500, resData);
													}
													else
													{
														console.log(mongoResult);
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
																	var messageData= {};
																	messageData.token = dbData2[0].pushToken;
																	messageData.badge_count = 1;
																	messageData.alert_message = '회원님의 땅이 '+dbData2[0].nickname+'님에게 정복당했습니다.';
																	messageData.payload = {
																		'type': 'conquer'
																	};
																	
																	if(dbData2[0].device == 'ANDROID')
																	{
																		push_manager.push_queue('PUSH_GCM_TASK_QUEUE', messageData);
																	}
																	else
																	{
																		push_manager.push_queue('PUSH_APNS_TASK_QUEUE', messageData);
																	}																	
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
												
												// Cron Start
												var CronJob = require('cron').CronJob;
												
												if(job != null)
												{
													job.stop();
													console.log('job stop!!');	
												}
												
												job = new CronJob({
													cronTime: '* * */1 * * *',
													onTick: function() {
														console.log('conquer award!!');
														
														mysql_manager.setMemberGatheringMoney(memberIndex, 100, function(err, mysqlResult3){
															if(err)
															{
																console.log('Mysql setMemberGatheringMoney() Error!!');
															}
														});
													},
													start: false,
													timeZone: "Asia/Seouol"
												});
												
												job.start();
												
												
												// Cron Start
												var CronJob2 = require('cron').CronJob;
												
												if(job != null)
												{
													job.stop();
													console.log('job stop!!');	
												}
												
												job2 = new CronJob({
													cronTime: '00 00 05 * * */1',
													onTick: function() {
														console.log('conquer award reset!!');
														job.stop();
													},
													start: false,
													timeZone: "Asia/Seouol"
												});
												
												job2.start();
												
												
												resData.resultCode = 1;
												resData.resultmessage = '성공';
												resData.data = {
													"memberIndex": memberIndex,
											        "teamIndex": dbData[0].teamIndex,
											        "landIndex": landIndex,
											        "profileImageUrl": dbData[0].profileImageUrl,
											        "nickname": dbData[0].nickname
												};
												
												response.json(200, resData);
												}
											});											
										}
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
		
	},
	
	
	touch : function touch(response, body, options) {
		
		console.log('touch');
		var resData = {};
		
		if(body.token != null && body.uuid != null && body.device != null && body.query.landIndex != null)
		{
			var token = body.token;
			var uuid = body.uuid;
			var device = body.device;
			
			var landIndex = body.query.landIndex;
			
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
					
					mysql_manager.getCurrentDong(landIndex, function(err, mysqlResult){
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
		
	},
	
	
	
	doInfo : function doInfo(response, body, options) {
		
		console.log('doInfo');
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
					var memberIndex = reply;
					
					mysql_manager.getDoInfo(function(err, mysqlResult){
						if(err)
						{
							resData.result = 10;
							resData.resultmessage = '서버 getDoInfo 오류';
							
							response.json(500, resData);
						}
						else
						{
							var dbData = JSON.parse(mysqlResult);
							var winnerTeam = 1;
							console.log(dbData);
							for(var i=0;i<dbData.length;i++)
							{
								if(dbData[i].blueTeamCount == 0 && dbData[i].whiteTeamCount == 0)
								{
									dbData[i].winnerTeam = 0;
								}
								else
								{
									if(dbData[i].blueTeamCount < dbData[i].whiteTeamCount)
									{
										dbData[i].winnerTeam = 2;
									}
									else if(dbData[i].blueTeamCount > dbData[i].whiteTeamCount)
									{
										dbData[i].winnerTeam = 1;
									}
									else
									{
										dbData[i].winnerTeam = 3;
									}
								}
								
								
							}
							
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
