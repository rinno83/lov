function DatabaseError() {
	this.message = '디비 오류';
	this.result = 100;
	this.stack = new Error().stack;
	this.code = 200;
	this.type = this.name;
}

DatabaseError.prototype = Object.create(Error.prototype);
DatabaseError.prototype.name = "DatabaseError";

module.exports = DatabaseError;