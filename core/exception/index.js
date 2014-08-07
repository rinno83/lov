var _                          = require('lodash'),
	path                       = require('path'),
	NotFoundUserError          = require('./notfoundusererror'),
	BadParameterError          = require('./badparametererror'),
	DatabaseError              = require('./databaseerror'),
	InternalServerError        = require('./internalservererror'),
	exception,

/**
 * Basic error handling helpers
 */
exception = {
	
	throwError: function (err) {
		
		if (!err) {
			console.log('error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			err = new Error("An error occurred");
		}

		if (_.isString(err)) {
			console.log('error@@@@@@@@@@@@@@@@@@@@@@@');
			throw new Error(err);
		}
		//console.log(err);

		throw err;
	}
	
};

module.exports                            = exception;
module.exports.NotFoundUserError          = NotFoundUserError;
module.exports.BadParameterError          = BadParameterError;
module.exports.DatabaseError              = DatabaseError;
module.exports.InternalServerError        = InternalServerError;