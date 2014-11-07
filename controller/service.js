var when				= require('when'),
	_				= require('lodash'),
	config			= require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),
	mysql_manager	= require('../handler/mysql_handler'),
	redis_manager	= require('../handler/redis_handler'),
	mongodb_manager	= require('../handler/mongodb_handler'),
	token_manager	= require('../handler/token_handler'),
	push_manager	= require('../handler/push_handler'),
	methodOverride	= require("method-override"),
	querystring		= require("querystring"),
	path			= require("path"),
	http  			= require("http"),
	crypto 			= require("crypto"),
	dateformat 		= require("dateformat"),	
	sync			= require('sync'),
	member;
	

function get_device_key(sid, device, uuid)
{
	return key_string = "DEVICE::"+sid+"::"+device+"::"+uuid;
	//return new Buffer(key_string).toString('base64');
}

function get_member_token_key(sid, device, token)
{
	return key_string = "TOKEN::"+sid+"::"+device+"::"+token;
}

function get_reg_token_key(sid, token)
{
	return key_string = "REGIST::"+sid+"::"+token;
}



service = {

	version : function version(response, body, options) {
		
		console.log('version');
		var resData = {};
		
		if(body.device != null)
		{
			var device = body.device;
			var serviceIndex = 1;
			
			mysql_manager.getServiceVersion(serviceIndex, device, function(err, mysqlResult){
				if(err)
				{
					resData.result = 10;
					resData.resultmessage = '서버 getServiceVersion() 오류';
					
					response.json(500, resData);
				}
				else
				{
					var dbData = JSON.parse(mysqlResult);
					var resArray = dbData[0];
					
					resArray.landDBFileUrl = 'http://54.64.38.36/files/tb_land.sqlite';
					
					resData.resultCode = 1;
					resData.resultmessage = '성공';
					resData.data = resArray;
					
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
	
	
	push : function push(response, body, options) {
		
		console.log('send push');
		var resData = {};
		
		var memberIndex = (body.memberIndex)?body.memberIndex:0;
		var title = body.title;
		var content = body.content;
		
		mysql_manager.getMemberPushToken(memberIndex, function(err, mysqlResult){
			if(err)
			{
				resData.result = 10;
				resData.resultmessage = '서버 getMemberToken() 오류';
				
				response.json(500, resData);
			}
			else
			{
				var dbData = JSON.parse(mysqlResult);
				
				for(var i=0;i<dbData.length;i++)
				{
					var messageData= {};
					var alertMessage = '';
					
					messageData.token = dbData[i].pushToken;
					messageData.badge_count = 1;
					messageData.alert_message = title;
					messageData.payload = {
						'type': 'notice',
						'content': content
					};

					if(dbData[i].device == 'ANDROID')
					{
						push_manager.push_queue('PUSH_GCM_TASK_QUEUE', messageData);
					}
					else
					{
						push_manager.push_queue('PUSH_APNS_TASK_QUEUE', messageData);
					}					
											
				}
				
				response.json(200, resData);
			}
		});		
	},
	
	
	reset : function reset(response, body, options) {
		
		console.log('reset!!');
		var resData = {};
				
		mysql_manager.setItemWinner(function(err, mysqlResult){
			if(err)
			{
				console.log('Mysql setItemWinner() Error!!');
			}
			else
			{
				var setItemWinnerResult = JSON.parse(mysqlResult);
				console.log('result : ' + setItemWinnerResult[0].result);
				
				for(var i=0;i<setItemWinnerResult.length;i++)
				{
					var messageData= {};
					var alertMessage = '';
					
					if(setItemWinnerResult[i].result == 1)
					{
						alertMessage = '축하합니다~ 회원님의 팀이 승리했습니다. 이번 시즌도 열심히 해보아요!!';
					}
					else if(setItemWinnerResult[i].result == 2)
					{
						alertMessage = '회원님의 팀이 패배했습니다. 이번 시즌에 더 열심히 해보아요!!';
					}
					else
					{
						alertMessage = '지난 시즌은 무승부입니다. 이번 시즌에는 이겨보아요!!';
					}
					
					
					messageData.token = setItemWinnerResult[i].pushToken;
					messageData.badge_count = 1;
					messageData.alert_message = alertMessage;
					messageData.payload = {
						'type': 'reset'
					};

					if(setItemWinnerResult[i].device == 'ANDROID')
					{
						push_manager.push_queue('PUSH_GCM_TASK_QUEUE', messageData);
					}
					else
					{
						push_manager.push_queue('PUSH_APNS_TASK_QUEUE', messageData);
					}					
											
				}
				
				// Delete Member Conquer Log
				mongodb_manager.delMemberConquerLog('conquer.log', function(err, mongoResult){
					if(err)
					{
						console.log('Mysql delMemberConquerLog() Error!!');
					}
				});
				
				// Delete Member Team Info
				mysql_manager.delMemberTeam(function(err, mysqlResult3){
					if(err)
					{
						console.log('Mysql delMemberTeam() Error!!');
					}
					else
					{
						// Delete Conquer Info
						mysql_manager.delMemberConquer(function(err, mysqlResult4){
							if(err)
							{
								console.log('Mysql deleMemberConquer() Error!!');
							}
							else
							{
								// Delete Conquer Info
								mysql_manager.initMemberTeam(function(err, mysqlResult4){
									if(err)
									{
										console.log('Mysql initMemberTeam() Error!!');
									}
									else
									{
										// Init Do Info
										mysql_manager.initDoInfo(function(err, mysqlResult4){
											if(err)
											{
												console.log('Mysql initDoInfo() Error!!');
											}
										});
									}
								});
							}
						});
						
						
					}
				});
				
				resData.result = 1;
				resData.resultmessage = '성공';
				
				response.json(200, resData);
			}
		});	
	}

};

module.exports = service;
