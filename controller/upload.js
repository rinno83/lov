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
	crypto 			= require("crypto")	
	

function get_member_token_key(device, token)
{
	return key_string = "TOKEN::"+device+"::"+token;
}

upload = {

	complete: function social(response, body, options) {
		
		//console.log('login');
		var resData = {};
		
		//console.log(body);
		
		
		response.json(200, resData);
	}

};

module.exports = upload;
