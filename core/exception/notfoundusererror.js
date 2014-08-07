function NotFoundUserError() {
	this.message = '존재하지 않는 회원 입니다';
	this.result = 102;
	this.stack = new Error().stack;
	this.code = 200;
	this.type = this.name;
}

NotFoundUserError.prototype = Object.create(Error.prototype);
NotFoundUserError.prototype.name = "NotFoundUserError";

module.exports = NotFoundUserError;
