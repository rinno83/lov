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

	version : function version(response, body, options) {
		
		console.log('conquer');
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
					
					resArray.landDBFileUrl = 'http://54.178.134.74/files/tb_land.sqlite';
					
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
		
	}

};

module.exports = service;
