var path = require('path'),
	config;

config = {
	// ### Development **(default)**
	development: {
		database: {
			host : '54.64.38.36',
			user : 'root',
			password : 'superapp5!',
			port : '3306'
		},
		server: {
			// Host to be passed to node's `net.Server#listen()`
			host: '127.0.0.1',
			// Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
			port: '9001'
		},
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		url : {
			host: 'http://localhost:8888/',
			path: 'files/'
		},
		mongodb: {
			url : 'mongodb://localhost:27017/doogoon_lov_log',
			host : '127.0.0.1',
			port : '27017',
			db : 'doogoon_lov_log'
		},
		rabbit: {
			connect : 'amqp://admin:superapp5!@54.64.38.36:5672'
		},
	},

	// ### Production
	// When running Ghost in the wild, use the production environment
	// Configure your URL and mail settings here
	production: {
		database: {
			host : '127.0.0.1',
			user : 'root',
			password : 'superapp5!',
			port : '3306'
		},
		server: {
			// Host to be passed to node's `net.Server#listen()`
			host: '127.0.0.1',
			// Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
			port: '9001'
		},
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		url : {
			host: 'http://54.178.134.74/',
			path: 'files/'
		},
		mongodb: {
			url : 'mongodb://localhost:27017/doogoon_lov_log',
			host : '127.0.0.1',
			port : '27017',
			db : 'doogoon_lov_log'
		},
		rabbit: {
			connect : 'amqp://admin:superapp5!@54.64.38.36:5672'
		},
	}
};

// Export config
module.exports = config;