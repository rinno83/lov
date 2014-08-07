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


member = {

	/**
	* @api {post} /regist/direct Regist Direct
	* @apiName Regist Direct
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {Int} level Regist Level.
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	* @apiParam {String} push_token Member Device Push Token [Optional].
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.token  Member Token.
	* @apiSuccess {String} data.level  Next Regist Level.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "result": 1,
	*	     "resultmessage": "성공",
	*	     "data": {
	*	        "token": "ooISUBM4nKJ3lACs5D4l17V2SBrj2/KjSWdv9j5rh8I=",
	*	        "level": 2
	*	     }
	*	  }
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	regist_direct: function regist_direct(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		if(body.level != null && body.uuid != null && body.device != null)
		{
			sid = options.sid;
			
			reg_level = body.level;
			uuid = body.uuid;
			device = body.device;
			push_token = (body.push_token == undefined)?null:body.push_token;
			
			mysql_manager.set_member_direct(sid, function(err, data){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					var dbData = JSON.parse(data);
					
					if(dbData[0].result_code == 1)
					{
						// Set Member Device in Mysql
						mysql_manager.set_member_device(sid, dbData[0].xid, device, uuid, push_token);
						
						// Set Member Token in Redis
						var redis_key = get_device_key(sid, device, uuid);
						
						var redis_instance = new redis_manager(config().redis);
						redis_instance.set(redis_key, dbData[0].xid, function(err, reply){});
					
						// Set Regist Level
						var save_level = reg_level - 1;
						mysql_manager.set_service_member_level(sid, dbData[0].xid, save_level);
						
						if(save_level == 0)
						{
							var member_token = token_manager.make_member_token(sid, dbData[0].xid, device, uuid);
							console.log('member_token : ' + member_token);
							
							// Set Member Token in Redis
							var redis_key = get_member_token_key(sid, device, member_token);
							
							var redis_instance = new redis_manager(config().redis);
							redis_instance.set(redis_key, dbData[0].xid, function(err, reply){});
							
							
							// Response
							var resArray = {
								'token':member_token,
								'level':save_level
							};
							resData.result = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
						else
						{
							var reg_token = token_manager.make_reg_token(sid, dbData[0].xid);
							console.log('reg_token : ' + reg_token);
							
							// Set Member Token in Redis
							var redis_key = get_reg_token_key(sid, reg_token);
							
							var redis_instance = new redis_manager(config().redis);
							redis_instance.set(redis_key, dbData[0].xid, function(err, reply){});
							
							// Response
							var resArray = {
								'token':reg_token,
								'level':save_level
							};
							resData.result = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
					}
					else
					{
						exception.throwError(new exception.DatabaseError());
					}
					
					
				}
			});
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	
	
	/**
	* @api {post} /token/check Member Token Check
	* @apiName Member Token Check
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {String} reg_token Regist Token [Optional].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.token  Member Token.
	* @apiSuccess {String} data.level  Next Regist Level.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "result": 1,
	*	     "resultmessage": "성공",
	*	     "data": {
	*	        "token": "ooISUBM4nKJ3lACs5D4l17V2SBrj2/KjSWdv9j5rh8I=",
	*	        "level": 2
	*	     }
	*	  }
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	token_check: function token_check(response, body, options) {
		var resData = {};
		
		if(body.uuid != null && body.device != null)
		{
			sid = options.sid;
			member_token = options.token;
			
			reg_token = body.reg_token;
			uuid = body.uuid;
			device = body.device;
						
			if(member_token == undefined && reg_token == undefined)
			{
				// 가입은 되어있지만 토큰을 잊어버렸을 때(앱을 지웠다 설치했을 경우)
				var redis_key = get_device_key(sid, device, uuid);
				var redis_instance = new redis_manager(config().redis);
				redis_instance.get(redis_key, function(err, data){
					if(err)
					{
						exception.throwError(new exception.DatabaseError());
					}
					else
					{
						mysql_manager.get_member_regist_level(sid, data, function(err, data2){
							if(err)
							{
								resData.result = 100;
								resData.resultmessage = '디비 오류.';
								response.json(200, resData);
							}
							else
							{
								var dbData = JSON.parse(data2);
								console.log(dbData);
								
								var member_level = dbData[0].reg_level;
								
								var member_token = token_manager.make_member_token(sid, data, device, uuid);
								console.log('member_token : ' + member_token);
								
								// Set Member Token in Redis
								var redis_key = get_member_token_key(sid, device, member_token);
								
								var redis_instance = new redis_manager(config().redis);
								redis_instance.set(redis_key, data, function(err, reply){});
								
								
								// Response
								var resArray = {
									'token':member_token,
									'level':member_level
								};
								resData.result = 1;
								resData.resultmessage = '성공';
								resData.data = resArray;
								
								response.json(200, resData);
							}
						});
					}
				});
			}
			else
			{
				// Regist incomplete
				if(member_token == undefined)
				{
					// Set Member Token in Redis
					var redis_key = get_reg_token_key(sid, reg_token);
					
					var redis_instance = new redis_manager(config().redis);
					redis_instance.get(redis_key, function(err, reply){
						if(err)
						{
							exception.throwError(new exception.DatabaseError());
						}
						else
						{
							if(reply == null)
							{
								resData.result = 102;
								resData.resultmessage = '존재하지 않는 회원 입니다.';
								response.json(200, resData);
							}
							else
							{
								mysql_manager.get_member_regist_level(sid, reply, function(err, data){
									if(err)
									{
										resData.result = 100;
										resData.resultmessage = '디비 오류.';
										response.json(200, resData);
									}
									else
									{
										var dbData = JSON.parse(data);
										
										var member_level = dbData[0].reg_level;
										
										// Response
										var resArray = {
											'token':reg_token,
											'level':member_level
										};
										resData.result = 1;
										resData.resultmessage = '성공';
										resData.data = resArray;
										
										response.json(200, resData);
									}
								});
							}							
						}
					});
				}
				else // Regist complete
				{
					// Set Member Token in Redis
					var redis_key = get_member_token_key(sid, device, member_token);
					
					var redis_instance = new redis_manager(config().redis);
					redis_instance.get(redis_key, function(err, reply){
						if(err)
						{
							exception.throwError(new exception.DatabaseError());
						}
						else
						{
							if(reply == null)
							{
								resData.result = 102;
								resData.resultmessage = '존재하지 않는 회원 입니다.';
								response.json(200, resData);
							}
							else
							{
								mysql_manager.get_member_regist_level(sid, reply, function(err, data){
									if(err)
									{
										resData.result = 100;
										resData.resultmessage = '디비 오류.';
										response.json(200, resData);
									}
									else
									{
										var dbData = JSON.parse(data);
										
										var member_level = dbData[0].reg_level;
										
										// Response
										var resArray = {
											'token':member_token,
											'level':member_level
										};
										resData.result = 1;
										resData.resultmessage = '성공';
										resData.data = resArray;
										
										response.json(200, resData);
									}
								});
							}							
						}
					});
				}	
			}
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	
	/**
	* @api {post} /regist/info/direct Member Regist Info
	* @apiName Member Regist Info
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {String} reg_token Regist Token [Optional].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	* @apiParam {Int} level Member Regist Level.
	* @apiParam {String} info Member info [Encryption].
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.token  Member Token.
	* @apiSuccess {String} data.level  Next Regist Level.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "result": 1,
	*	     "resultmessage": "성공",
	*	     "data": {
	*	        "token": "ooISUBM4nKJ3lACs5D4l17V2SBrj2/KjSWdv9j5rh8I=",
	*	        "level": 2
	*	     }
	*	  }
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	regist_info_direct: function regist_info_direct(response, body, options) {
		var resData = {};
		
		if(body.reg_token != null && body.level != null && body.uuid != null && body.device != null && body.info != null)
		{
			sid = options.sid;
			skey = options.skey;
			
			reg_token = body.reg_token;
			uuid = body.uuid;
			device = body.device;
			reg_level = body.level;
			info = body.info;
			
			var redis_key = get_reg_token_key(sid, reg_token);
					
			var redis_instance = new redis_manager(config().redis);
			redis_instance.get(redis_key, function(err, reply){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					if(reply == null)
					{
						resData.result = 102;
						resData.resultmessage = '존재하지 않는 회원 입니다.';
						response.json(200, resData);
					}
					else
					{
						var xid = reply;
						var collection = 'xenix_'+skey+'_info';
						
						mongodb_manager.set_member_info(collection, xid, info);	
					
					
						// Set Regist Level
						var save_level = reg_level - 1;
						mysql_manager.set_service_member_level(sid, reply, save_level);
						
						if(save_level == 0)
						{
							var member_token = token_manager.make_member_token(sid, reply, device, uuid);
							console.log('member_token : ' + member_token);
							
							// Set Member Token in Redis
							var redis_key = get_member_token_key(sid, device, member_token);
							
							var redis_instance = new redis_manager(config().redis);
							redis_instance.set(redis_key, reply, function(err, reply){});
							
							
							// Response
							var resArray = {
								'token':member_token,
								'level':save_level
							};
							resData.result = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
						else
						{
							// Response
							var resArray = {
								'token':reg_token,
								'level':save_level
							};
							resData.result = 1;
							resData.resultmessage = '성공';
							resData.data = resArray;
							
							response.json(200, resData);
						}
					}
				}
			});
			
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	
	/**
	* @api {post} /regist/device/direct Member Regist Device
	* @apiName Member Regist Device
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	* @apiParam {String} push_token Member Device Push Token.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "result": 1,
	*	     "resultmessage": "성공"
	*	  }
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	regist_device_direct: function regist_device_direct(response, body, options) {
		var resData = {};
		
		if(body.push_token != null && body.uuid != null && body.device != null)
		{
			sid = options.sid;
			token = options.token;
			
			uuid = body.uuid;
			device = body.device;
			push_token = body.push_token;
			
			var redis_key = get_member_token_key(sid, device, token);
					
			var redis_instance = new redis_manager(config().redis);
			redis_instance.get(redis_key, function(err, reply){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					if(reply == null)
					{
						resData.result = 102;
						resData.resultmessage = '존재하지 않는 회원 입니다.';
						response.json(200, resData);
					}
					else
					{
						var xid = reply;
						mysql_manager.set_member_device(sid, xid, device, uuid, push_token);
						
						resData.result = 1;
						resData.resultmessage = '성공';
						
						response.json(200, resData);
					}
				}
			});
			
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	/**
	* @api {post} /regist/profile Member Regist Profile Photo
	* @apiName Member Regist Profile Photo
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	* @apiParam {String} profile_url Member Profile Photo URL.
	* @apiParam {String} thumbnail_url Member Thumbnail Profile Photo URL.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "result": 1,
	*	     "resultmessage": "성공"
	*	  }
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	regist_profile: function regist_profile(response, body, options) {
		var resData = {};
		
		if(body.profile_url != null && body.thumbnail_url != null && body.device != null)
		{
			sid = options.sid;
			skey = options.skey;
			token = options.token;
			
			profile_url = body.profile_url;
			thumbnail_url = body.thumbnail_url;
			device = body.device;
			uuid = body.uuid;
			
			var redis_key = get_member_token_key(sid, device, token);
					
			var redis_instance = new redis_manager(config().redis);
			redis_instance.get(redis_key, function(err, reply){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					if(reply == null)
					{
						resData.result = 102;
						resData.resultmessage = '존재하지 않는 회원 입니다.';
						response.json(200, resData);
					}
					else
					{
						var xid = reply;
						var collection = 'xenix_'+skey+'_profile';
						
						mongodb_manager.set_member_profile(collection, xid, profile_url, thumbnail_url);	
						
						resData.result = 1;
						resData.resultmessage = '성공';
						
						response.json(200, resData);
					}
				}
			});
			
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	
	
	/**
	* @api {post} /member/profile Get Member Profile Photo
	* @apiName Get Member Profile Photo
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.profile_url  Member Profile Photo URL.
	* @apiSuccess {String} data.thumbnail_url  Member Thumbnail Profile Photo URL.	
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "result": 1,
	*	    "resultmessage": "성공",
	*	    "data": {
	*	        "profile_url": "http://4.bp.blogspot.com/-npZ_9DmQfHY/UuB1IO221KI/AAAAAAAACS4/Iam0nyO_DMg/s1600/1%25B9%25DA2%25C0%25CF_E442_130609_HDTV_H264_720p-WITH_mp4_002895692.jpg",
	*	        "thumbnail_url": "http://i.imgur.com/wbiNjPv.jpg"
	*	    }
	*	}
	*
	* @apiErrorExample DB Error-Response:
	*     HTTP/1.1 200 DB Error
	*     {
	*        "result": 100,
	*	     "resultmessage": "디비 오류",
	*	     "type": "DatabaseError"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 200 Parameter Error
	*     {
	*        "result": 101,
	*	     "resultmessage": "파라미터 오류",
	*	     "type": "BadParameterError"
	*     }
	* @apiErrorExample NotFound Error-Response:
	*     HTTP/1.1 200 NotFound Error
	*     {
	*        "result": 102,
	*	     "resultmessage": "존재하지 않는 회원 입니다",
	*	     "type": "NotFoundUserError"
	*     }
	* @apiError (Exception 하단 참고) 100 디비 오류.
	* @apiError (Exception 하단 참고) 101 파라미터 오류.
	* @apiError (Exception 하단 참고) 102 존재하지 않는 회원 입니다.
	*/
	profile: function profile(response, body, options) {
		var resData = {};
		
		if(body.device != null)
		{
			sid = options.sid;
			skey = options.skey;
			token = options.token;
			
			device = body.device;
			uuid = body.uuid;
			
			var redis_key = get_member_token_key(sid, device, token);
					
			var redis_instance = new redis_manager(config().redis);
			redis_instance.get(redis_key, function(err, reply){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					if(reply == null)
					{
						resData.result = 102;
						resData.resultmessage = '존재하지 않는 회원 입니다.';
						response.json(200, resData);
					}
					else
					{
						var xid = reply;
						var collection = 'xenix_'+skey+'_profile';
						
						mongodb_manager.get_member_profile(collection, xid, function(err, docs){
							if(err)
							{
								resData.result = 100;
								resData.resultmessage = '디비 오류.';
								response.json(200, resData);
							}
							else
							{	
								var profile_data = {
									'profile_url': docs[0].profile_url,
									'thumbnail_url': docs[0].thumbnail_url
								};
								resData.result = 1;
								resData.resultmessage = '성공';
								resData.data = profile_data;
								
								response.json(200, resData);
							}
						});							
					}
				}
			});
			
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	}

};

module.exports = member;
