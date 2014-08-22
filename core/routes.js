var controller  = require('../controller/index.js'),
	apiRoutes;

apiRoutes = function (server) {
	
	console.log("api route ...");
	
	// Member
	server.post('/member/social', controller.http(controller.member.social));
	server.get('/member/token', controller.http(controller.member.token));
	server.put('/friend/sync', controller.http(controller.member.friend_sync));
	server.get('/member/info', controller.http(controller.member.info));
	server.put('/member/info/update', controller.http(controller.member.info_update));
	server.get('/member/logout', controller.http(controller.member.logout));


	// File
	server.post('/upload/complete', controller.http(controller.upload.complete));
		
};

module.exports = apiRoutes;