function InternalServerError() {
	this.message = '서버 오류';
	this.result = 999;
	this.stack = new Error().stack;
	this.code = 200;
	this.type = this.name;
}

InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.name = "InternalServerError";

module.exports = InternalServerError;
