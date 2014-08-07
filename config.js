var path = require('path'),
	config;

config = {
	// ### Development **(default)**
	development: {
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
		}
	},

	// ### Production
	// When running Ghost in the wild, use the production environment
	// Configure your URL and mail settings here
	production: {
		api : {
			host : 'api.halgame.com',
			port : '80'
		},
		database: {
			host : '192.168.101.44',
			user : 'root',
			password : '1qw2!QW@',
			port : '3306'
		},
		server: {
			// Host to be passed to node's `net.Server#listen()`
			host: '127.0.0.1',
			// Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
			port: '8080'
		},
		redis: {
			host: '192.168.101.44',
			port: '6379'
		},
		rabbit: {
			connect : 'amqp://admin:1qw2!QW@@192.168.100.62:5673'
		},
		mongodb: {
			url : 'mongodb://localhost:27017/xenix_member_db',
			host : '127.0.0.1',
			port : '27017',
			db : 'xenix_member_db'
		}
	}
};

// Export config
module.exports = config;