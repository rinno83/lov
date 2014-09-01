var apn 			= require('apn'),
	mysql_manager	= require('../handler/mysql_handler');

exports.sendAPNS = function(memberToken){
	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './cert.pem',
		key: './key.pem'	
	};
	
	var apnConnection = new apn.Connection(options);
	
	var myDevice = new apn.Device(memberToken);

	var note = new apn.Notification();
	note.badge = 3;
	note.alert = 'saltfactory 푸시 테스트';
	note.payload = {'message': '안녕하세요'};
	
	apnConnection.pushNotification(note, myDevice);
};
