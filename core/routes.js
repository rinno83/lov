var controller  = require('../controller/index.js'),
	apiRoutes;

apiRoutes = function (server) {
	
	console.log("api route ...");
	
	// Member
	server.post('/member/social', controller.http(controller.member.social));
	server.get('/member/token', controller.http(controller.member.token));
	server.get('/member/info', controller.http(controller.member.info));
	server.put('/member/info', controller.http(controller.member.info_update));
	server.get('/member/logout', controller.http(controller.member.logout));
	server.get('/member/rank', controller.http(controller.member.rank));
	server.get('/member/history', controller.http(controller.member.history));
	server.post('/member/money/gatheringStart', controller.http(controller.member.moneyWalkGatheringStart));
	server.post('/member/money/gathering', controller.http(controller.member.moneyWalkGathering));
	server.post('/member/money/gatheringEnd', controller.http(controller.member.moneyWalkGatheringEnd));

	// Land
	server.post('/land/conquer', controller.http(controller.land.conquer));
	server.get('/land/current', controller.http(controller.land.current));
	server.get('/land/do', controller.http(controller.land.doInfo));
	
	// Service
	server.get('/service/version', controller.http(controller.service.version));
	server.post('/service/reset', controller.http(controller.service.reset));
	server.post('/service/push', controller.http(controller.service.push));

	// File
	server.post('/upload/complete', controller.http(controller.upload.complete));
	
	// Team
	server.get('/team/info', controller.http(controller.team.info));
	server.get('/team/rank', controller.http(controller.team.rank));
	
	server.get('/member/code', controller.http(controller.member.code));	
		
};

module.exports = apiRoutes;