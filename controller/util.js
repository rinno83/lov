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
	cron			= require('cron'),
	member;
	
function deg2rad(val) {
	var pi = Math.PI;
	var de_ra = ((eval(val))*(pi/180));
	return de_ra;
}

util = {

	getMemberTokenKey: function getMemberTokenKey(device, token) {
		return key_string = "TOKEN::"+device+"::"+token;
	},
	
	getMeter: function getMeter(lat1, lon1, lat2, lon2) {
		delta_lon = deg2rad(lon2) - deg2rad(lon1);
	
		distance = Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.cos(delta_lon)) * 3963.189; //마일
		
		gap = parseInt(distance * 1609.344);
		return gap;
	}


};

module.exports = util;
