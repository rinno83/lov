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

	// Land
	server.post('/land/conquer', controller.http(controller.land.conquer));
	
	// Service
	server.get('/service/version', controller.http(controller.service.version));
	server.post('/service/push_test', controller.http(controller.service.push_test));

	// File
	server.post('/upload/complete', controller.http(controller.upload.complete));
	
	// Team
	server.get('/team/info', controller.http(controller.team.info));
		
};

module.exports = apiRoutes;