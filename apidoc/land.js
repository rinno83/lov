/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Land Member Conquer										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {post} /land/conquer 땅 정복
	* @apiName 땅 정복
	* @apiGroup Land
	*
	* @apiParam {String} landIndex Land Index.
	* @apiParam {String} lat Current Member Location Latitude.
	* @apiParam {String} lon Current Member Location Longitude.
	* @apiParam {Int} investMoney Member Invest Money.
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공"	
	*	  }
	*
	*/



/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Current Land List										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /land/current 현재 화면 동 리스트
	* @apiName 현재 화면 동 리스트
	* @apiGroup Land
	*
	* @apiParam {String} northWestLat 왼쪽 상단 Latitude
	* @apiParam {String} northWestLon 왼쪽 상단 Longitude
	* @apiParam {String} southEashLat 오른쪽 하단 Latitude
	* @apiParam {String} southEashLon 오른쪽 하단 Longitude
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.memberIndex 회원 Index
	* @apiSuccess {Int} data.teamIndex 팀 Index
	* @apiSuccess {Int} data.landIndex 땅 Index
	* @apiSuccess {String} data.profileImageUrl 회원 프로필 이미지 사진 URL 
	* @apiSuccess {String} data.nickname 회원 닉네임
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공",
			 "data": [
			     {
			         "memberIndex": null,
			         "teamIndex": null,
			         "landIndex": 3451,
			         "profileImageUrl": null,
			         "nickname": null
			     },
			     {
			         "memberIndex": 9,
			         "teamIndex": 1,
			         "landIndex": 3452,
			         "profileImageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/c34.34.431.431/s50x50/200153_137830039620881_8344528_n.jpg?oh=1d6bc3f489bb9a0d7bdb8eb1daeed616&oe=54750C2F&__gda__=1415730926_828c383c054206b87cd8ccfa598431d0",
			         "nickname": "Jaehyun Lee"
			     },	
			     {
			         ...
			     }	
	*	  }
	*
	*/




/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Current Land Info										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /land/touch 현재 화면 동 정보
	* @apiName 현재 화면 동 정보
	* @apiGroup Land
	*
	* @apiParam {Int} landIndex 현재 동 Index
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.memberIndex 회원 Index
	* @apiSuccess {Int} data.teamIndex 팀 Index
	* @apiSuccess {Int} data.landIndex 땅 Index
	* @apiSuccess {String} data.profileImageUrl 회원 프로필 이미지 사진 URL 
	* @apiSuccess {String} data.nickname 회원 닉네임
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공",
			 "data": [
			     {
			         "memberIndex": null,
			         "teamIndex": null,
			         "landIndex": 3451,
			         "profileImageUrl": null,
			         "nickname": null
			     },
			     {
			         "memberIndex": 9,
			         "teamIndex": 1,
			         "landIndex": 3452,
			         "profileImageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/c34.34.431.431/s50x50/200153_137830039620881_8344528_n.jpg?oh=1d6bc3f489bb9a0d7bdb8eb1daeed616&oe=54750C2F&__gda__=1415730926_828c383c054206b87cd8ccfa598431d0",
			         "nickname": "Jaehyun Lee"
			     },	
			     {
			         ...
			     }	
	*	  }
	*
	*/

