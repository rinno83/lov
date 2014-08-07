function BadParameterError() {
	this.message = '파라미터 오류';
	this.result = 101;
	this.stack = new Error().stack;
	this.code = 200;
	this.type = this.name;
}

BadParameterError.prototype = Object.create(Error.prototype);
BadParameterError.prototype.name = "BadParameterError";

module.exports = BadParameterError;
