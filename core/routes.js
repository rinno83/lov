var controller  = require('../controller/index.js'),
	apiRoutes;

apiRoutes = function (server) {
	
	console.log("api route ...");
	
	// Member
	server.post('/regist/direct', controller.http(controller.member.regist_direct));
	server.post('/token/check', controller.http(controller.member.token_check));
	server.post('/regist/info/direct', controller.http(controller.member.regist_info_direct));
	server.post('/regist/device/direct', controller.http(controller.member.regist_device_direct));
	server.post('/regist/profile', controller.http(controller.member.regist_profile));
	server.post('/member/profile', controller.http(controller.member.profile));
	
	// Service
	server.post('/service/terms', controller.http(controller.service.terms));
	server.post('/service/terms/agree', controller.http(controller.service.terms_agree));
	server.post('/service/version', controller.http(controller.service.version));
		
};

module.exports = apiRoutes;