var apn 			= require('apn'),
	mysql_manager	= require('../handler/mysql_handler'),
	amqp			= require('amqplib'),
	when			= require('when'),
	config 			= require('../core/configuration/index.js');

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



exports.push_queue = function(queueName, messageData){
	console.log(queueName);
	var message = JSON.stringify(messageData);
	
	console.log(message);
	
	amqp.connect(config().rabbit.connect).then(function(conn) {
	  return when(conn.createChannel().then(function(ch) {
	    var q = queueName;
	    var ok = ch.assertQueue(q, {durable: true});
	    
	    return ok.then(function() {
	      ch.sendToQueue(q, new Buffer(message), {deliveryMode: true});
	      console.log(" [x] Sent '%s'", message);
	      return ch.close();
	    });
	  })).ensure(function() { conn.close(); });
	}).then(null, console.warn);
};
