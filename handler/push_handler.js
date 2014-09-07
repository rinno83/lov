var apn 			= require('apn'),
	mysql_manager	= require('../handler/mysql_handler');

exports.sendAPNS = function(memberToken, title, content){
	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './cert.pem',
		key: './key.pem'	
	};
	
	var apnConnection = new apn.Connection(options);
	
	var myDevice = new apn.Device(memberToken);

	var note = new apn.Notification();
	note.badge = 1;
	note.alert = title;
	note.payload = {'message': content};
	
	apnConnection.pushNotification(note, myDevice);
};
