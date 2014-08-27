/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									get Service Version										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /service/version 서비스 및 땅 버전 체크
	* @apiName 서비스 및 땅 버전 체크
	* @apiGroup Service
	*
	*
	* @apiSuccess {String} resultMessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.versionCode  Service Version Code [ Int형 ].
	* @apiSuccess {String} data.versionName  Service Version Name [ ex) 1.0.0 ].
	* @apiSuccess {String} data.storeUrl  Service Store URL.
	* @apiSuccess {String} data.landDBFileVersion  Land DB File Version Code [ Int형 ].
	* @apiSuccess {String} data.resetCount  Game Reset Count.
	* @apiSuccess {String} data.landDBFileUrl  Land DB File URL.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultMessage": "성공",
	*	     "data": {
	*	        "versionCode": 1,
	*	        "versionName": "1.0.0",
	*	        "storeUrl": null,
	*	        "landDBFileVersion": 1,
	*	        "resetCount": 1,
	*	        "landDBFileUrl": "http://54.178.134.74/files/tb_land.sqlite"
	*	    }
	*	  }
	*
	*/

