var crypto 			= require("crypto");

exports.make_member_token = function(sid, xid, device, uuid){
	var current_time = new Date().getTime();
			
	var tb = sid.toString() + xid.toString() + device + uuid + current_time;

	var token = crypto.createHash('sha256').update(tb).digest('base64');

	return token;
};


exports.make_reg_token = function(sid, xid){
	var current_time = new Date().getTime();
			
	var tb = sid.toString() + xid.toString() + current_time;

	var token = crypto.createHash('sha256').update(tb).digest('base64');

	return token;
};
