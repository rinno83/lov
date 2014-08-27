// # Ghost Data API
// Provides access to the data model

var _             = require('lodash'),
	when          = require('when'),
	config        = require('../core/configuration/index.js'),
	exception		= require('../core/exception/index.js'),	
	member        = require('./member'),
	service        = require('./service'),
	upload        = require('./upload'),
	land        = require('./land'),
	util        = require('./util'),
	mysql_manager	= require('../handler/mysql_handler'),	
	redis_manager = require('../handler/redis_handler'),
	winston 		= require("winston"),	
	http,
	formatHttpErrors,
	loadController;

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: 'log/exceptions.log', timestamp: true })
	]
/*
	,
	exceptionHandlers: [
		new winston.transports.File({
			filename: 'log/exceptions.log'
		})
	],
	exitOnError: false
*/
});	

/**
 * ### Format HTTP Errors
 * Converts the error response from the API into a format which can be returned over HTTP
 *
 * @private
 * @param {Array} error
 * @return {{errors: Array, statusCode: number}}
 */
formatHttpErrors = function (error) {
	var statusCode = 500,
		errorContent = {};

	
	if(error.result == null || error.result == undefined) {
		errorContent = {};
		
		statusCode = error.code || 500;
		
		errorContent.message = _.isString(error) ? error :
			(_.isObject(error) ? error.message : 'Unknown API Error');
		errorContent.type = error.type || 'InternalServerError';	
	}
	else {
		statusCode = error.code;
		
		errorContent.result = error.result;
		errorContent.resultmessage = error.message;
		errorContent.type = error.type;
	}
	return {error: errorContent, statusCode: statusCode};
};

loadController = function(apiMethod, object, res, options) {
	// If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
	// If this is a PUT, POST, or PATCH, req.body is an object
	if (_.isEmpty(object)) {
		object = options;
		options = {};
	}
	
	try {
		apiMethod(res, object, options);
	}
	catch (err) {
		logger.log('error', err.message);
		
		var httpErrors = formatHttpErrors(err);
		// Send a properly formatted HTTP response containing the errors
		res.json(httpErrors.statusCode, httpErrors.error);		
	}
}


/**
 * ### HTTP
 *
 * Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 *
 * @public
 * @param {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by the route when a matching request is made
 */
http = function (apiMethod) {
	return function (req, res) {
		var object = req.body,
			options = {};	
		
		object.uuid = req.headers.uuid;
		object.device = req.headers.device;
		
		if( req.headers != undefined && req.headers.accesstoken != undefined ) 
		{
			object.token = req.headers.accesstoken;			
						
			loadController(apiMethod, object, res, options);		
		}
		else
		{
			loadController(apiMethod, object, res, options);
		}		
	};
};

module.exports = {
	http: http,
	member: member,
	service: service,
	upload: upload,
	util: util,
	land: land
};
