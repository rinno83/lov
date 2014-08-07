// General entry point for all configuration data
//
// This file itself is a wrapper for the root level config.js file.
// All other files that need to reference config.js should use this file.

var path          = require('path'),
	when          = require('when'),
	url           = require('url'),
	_             = require('lodash'),
	serverConfig  = {},
	appRoot       = path.resolve(__dirname, '../../'),
	corePath      = path.resolve(appRoot, 'core/');


function updateConfig(config) {
	// Merge passed in config object onto
	// the cached ghostConfig object
	_.merge(serverConfig, config);

	return serverConfig;
}

function initConfig(rawConfig) {
	return updateConfig(rawConfig);
}

// Returns NODE_ENV config object
function config() {
	// @TODO: get rid of require statement.
	// This is currently needed for tests to load config file
	// successfully.  While running application we should never
	// have to directly delegate to the config.js file.
	console.log("log init .." + process.env.NODE_ENV);

	if (_.isEmpty(serverConfig)) {
		try {
			serverConfig = require(path.resolve(__dirname, '../../', 'config.js'))[process.env.NODE_ENV] || {};			
		} catch (ignore) {/*jslint strict: true */}
		serverConfig = updateConfig(serverConfig);
	}

	return serverConfig;
}

module.exports = config;
module.exports.init = initConfig;