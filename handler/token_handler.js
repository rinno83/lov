var crypto 			= require("crypto");

exports.makeMemberToken = function(memberIndex, device, uuid){
	var current_time = new Date().getTime();
			
	var tb = memberIndex.toString() + device + uuid + current_time;

	var token = crypto.createHash('sha256').update(tb).digest('base64');

	return token;
};
