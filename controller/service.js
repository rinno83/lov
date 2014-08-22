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

	

};

module.exports = service;
