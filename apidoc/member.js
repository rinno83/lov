/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Regist Member Social									   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {post} /member/social 소셜 회원가입 및 로그인
	* @apiName 소셜 회원가입 및 로그인
	* @apiGroup Member
	*
	* @apiParam {Int} registLevel Regist Level.[2 고정]
	* @apiParam {String} socialId Member Social ID.
	* @apiParam {String} socialType Member Social Type [MT001 : Kakao, MT002 : Facebook, MT003 : Naver ].
	*
	* @apiSuccess {String} resultMessage  Result Message.
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.token  Member Token.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultMessage": "성공",
	*	     "data": {
	*	        "token": "NDliZTZlMjllZTNmMGNiOGZkOGRiNzQxZGVjNDZhMjg0ZDQ2ODdlYjgwNTc5ODgzNTVlZTZiZjdhNjdjNmQwNQ==",
	*	     }
	*	  }
	*
	*/


/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member Token Check									 	   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /member/token 회원 토큰 체크
	* @apiName 회원 토큰 체크
	* @apiGroup Member
	*
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
//									Member Friend Sync										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {put} /friend/sync 회원 친구 동기화
	* @apiName 회원 친구 동기화
	* @apiGroup Member
	*
	*
	* @apiParam {String} friends Member Facebook Friends [JsonArray].	
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
//									Member Info												   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /member/info 회원 정보 가져오기
	* @apiName 회원 정보 가져오기
	* @apiGroup Member
	*
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.nickname  Member Nickname.	
	* @apiSuccess {String} data.profileImageUrl  Member Profile Image URL.	
	* @apiSuccess {String} data.teamName  Member Team Name.	
	* @apiSuccess {String} data.teamImageUrl  Member Team Image URL.	
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공",
	*	   	 "data": {
	*	        "nickname": "doogoon",
	*	        "profileImageUrl": "http://image.tvdaily.co.kr/upimages/gisaimg/201203/1330754784_281586.jpg",
	*	        "teamName": "blue",
	*	        "teamImageUrl": "http://rlv.zcache.com/team_blue_polka_dot_stars_round_sticker-p217941021613239303en8ct_265.jpg"
	*	    }
	*	  }
	*
	*/
	
	
	

/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member Info	Update										   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {put} /member/info/update 회원 정보 수정
	* @apiName 회원 정보 수정
	* @apiGroup Member
	*
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.nickname  Member Nickname.	
	* @apiSuccess {String} data.profileImageUrl  Member Profile Image URL.	
	* @apiSuccess {String} data.teamName  Member Team Name.	
	* @apiSuccess {String} data.teamImageUrl  Member Team Image URL.	
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공",
	*	   	 "data": {
	*	        "nickname": "doogoon",
	*	        "profileImageUrl": "http://image.tvdaily.co.kr/upimages/gisaimg/201203/1330754784_281586.jpg",
	*	        "teamName": "blue",
	*	        "teamImageUrl": "http://rlv.zcache.com/team_blue_polka_dot_stars_round_sticker-p217941021613239303en8ct_265.jpg"
	*	    }
	*	  }
	*
	*/	




/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member Logout											   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /member/logout 회원 로그아웃
	* @apiName 회원 로그아웃
	* @apiGroup Member
	*
	*
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

