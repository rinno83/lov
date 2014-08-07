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
	dateformat 		= require("dateformat"),
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

	/**
	* @api {post} /service/terms Get Service Terms
	* @apiName Get Service Terms
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {String} lang Service Terms Language.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.termsid  Service Terms Index.
	* @apiSuccess {Int} data.sid  Service Index.
	* @apiSuccess {String} data.lang  Service Terms Language.
	* @apiSuccess {Int} data.terms_type  Service Terms Type [1 : Service Terms, 2 : Private Terms].
	* @apiSuccess {String} data.terms_title  Service Terms Title.
	* @apiSuccess {String} data.terms_content  Service Terms Content.
	* @apiSuccess {String} data.is_show  서비스 약관 보임 여부.
	* @apiSuccess {String} data.update_date  Service Terms Update Date.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "result": 1,
	*	    "resultmessage": "성공",
	*	    "data": [
	*	        {
	*	            "termsid": 3,
	*	            "sid": 14,
	*	            "lang": "ko",
	*	            "terms_type": 1,
	*	            "terms_title": "서비스 이용 약관",
	*	            "terms_content": "아노미챗 이용약관",
	*	            "is_show": "Y",
	*	            "update_date": "2014-03-27 22:02:34"
	*	        },
	*	        {
	*	            "termsid": 4,
	*	            "sid": 14,
	*	            "lang": "ko",
	*	            "terms_type": 2,
	*	            "terms_title": "개인정보보호 취급방침",
	*	            "terms_content": "아노미챗 개인정보보호 취급방침",
	*	            "is_show": "Y",
	*	            "update_date": "2014-03-27 22:02:20"
	*	        }
	*	    ]
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
	terms: function terms(response, body, options) {
		var resData = {};
		
		if(body.lang != null)
		{
			sid = options.sid;
			
			lang = body.lang;
			
			mysql_manager.get_service_terms(sid, lang, function(err, data){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					var dbData = JSON.parse(data);
					
					for(var i in dbData)
					{
						dbData[i].update_date = dateformat(dbData[i].update_date, 'yyyy-mm-dd HH:MM:ss');
					}
					
					resData.result = 1;
					resData.resultmessage = '성공';
					resData.data = dbData;
					response.json(200, resData);
				}
			});
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	},
	
	
	
	
	/**
	* @api {post} /service/terms/agree Agree Service Terms
	* @apiName Agree Service Terms
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {String} uuid Member Device UUID.
	* @apiParam {String} device Member Device OS Name.
	* @apiParam {String} reg_token Member Regist Token.
	* @apiParam {Int} level Member Regist Level.
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
	*	    "result": 1,
	*	    "resultmessage": "성공",
	*	    "data": {
	*	        "token": "CFyN1OHSlYaaM8kTNxbcR/s6mIPQoJ6K493R/jVG2AU=",
	*	        "level": 0
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
	terms_agree: function terms_agree(response, body, options) {
		var resData = {};
		
		if(body.uuid != null && body.device != null && body.level != null && body.reg_token != null)
		{
			sid = options.sid;
			
			reg_token = body.reg_token;
			uuid = body.uuid;
			device = body.device;
			reg_level = body.level;
			
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
						res.json(200, resData);
					}
					else
					{
						var xid = reply;
						
						// Set Regist Level
						var save_level = reg_level - 1;
						mysql_manager.set_service_member_level(sid, xid, save_level);
						
						if(save_level == 0)
						{
							var member_token = token_manager.make_member_token(sid, xid, device, uuid);
							console.log('member_token : ' + member_token);
							
							// Set Member Token in Redis
							var redis_key = get_member_token_key(sid, device, member_token);
							
							var redis_instance = new redis_manager(config().redis);
							redis_instance.set(redis_key, xid, function(err, reply){});
							
							
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
	* @api {post} /service/version Get Service Version
	* @apiName Get Service Version
	* @apiGroup xenixstudio API
	*
	* @apiParam {String} service_key Service Key [Header].
	* @apiParam {String} Accesstoken Member Token [Header, Optional].
	* @apiParam {String} device Member Device OS Name.
	*
	* @apiSuccess {int} result Result code.
	* @apiSuccess {String} resultmessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.version  Service Version.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "result": 1,
	*	    "resultmessage": "성공",
	*	    "data": {
	*	        "version": "1.0"
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
	version: function version(response, body, options) {
		var resData = {};
		
		if(body.device != null)
		{
			sid = options.sid;
			
			device = body.device;
			
			mysql_manager.get_service_version(sid, device, function(err, data){
				if(err)
				{
					exception.throwError(new exception.DatabaseError());
				}
				else
				{
					var dbData = JSON.parse(data);
					
					resData.result = 1;
					resData.resultmessage = '성공';
					resData.data = dbData[0];
					
					response.json(200, resData);
				}
			});			
		}
		else {
			exception.throwError(new exception.BadParameterError());
		}
		
	}

};

module.exports = service;
