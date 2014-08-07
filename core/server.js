// Include the cluster module
var cluster = require('cluster'),
	routes = require('./routes'),
	config = require('./configuration/index.js'),
	bodyParser 	= require("body-parser"),
	methodOverride = require("method-override"),
	start ;

start = function start()
{
	if (cluster.isMaster) {
		// Count the machine's CPUs
	    var cpuCount = require('os').cpus().length;
	    
	    // Create a worker for each CPU
	    for (var i = 0; i < cpuCount; i += 1) {
	    		cluster.fork();
	    }
	    
		cluster.on('exit', function (worker) {
		
			// Replace the dead worker,
			// we're not sentimental
			console.log('Worker ' + worker.id + ' died :(');
			cluster.fork();
		
		});
	}
	else {
		var express = require('express');
	    
	    // Create a new Express application
	    var server = express();	    
	    
		server.use(bodyParser());
		server.use(methodOverride());
	    
		routes(server);
	    
	    server.get('/', function (req, res) {
	    		res.send('Hello from Worker ' + cluster.worker.id);
	    });
	    
	    console.log(config().server);
	    
	    // Bind to a port
	    server.listen(config().server.port);
	    
	    console.log('Application running!');
	}
}

module.exports.start = start;