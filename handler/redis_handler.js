var redis = require("redis");

function redisConnection(redisConfig) {
	this.redisClient = redis.createClient(redisConfig.port, redisConfig.host);
}

redisConnection.prototype.set = function set(key, val, fn) {
	this.redisClient.set(key, val, function(err, reply){
		
		return fn(null, reply);
	}); // redis.print -> log
	
	this.redisClient.quit();
}

redisConnection.prototype.get = function get(key, fn) {
	this.redisClient.get(key, function(err, reply){
		return fn(null, reply);
	});
	
	this.redisClient.quit();
}

redisConnection.prototype.del = function del(key, fn) {
	this.redisClient.del(key, function(err, reply){
		return fn(null, reply);
	}); // redis.print -> log
	
	this.redisClient.quit();
}

redisConnection.prototype.expire = function expire(key, expire_time) {
	this.redisClient.expire(key, expire_time, function(err, reply){
	}); // redis.print -> log
	
	this.redisClient.quit();
}


module.exports = redisConnection;

