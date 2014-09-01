/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//							Regist Member Social && Member Login							   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {post} /member/social 소셜 회원가입 및 로그인
	* @apiName 소셜 회원가입 및 로그인
	* @apiGroup Member
	*
	* @apiParam {String} socialId Member Social ID.
	* @apiParam {String} nickname Member Nickname.
	* @apiParam {String} profileImageUrl Member Profile Image URL.
	* @apiParam {String} pushToken Member Device Push Token.
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.token  Member Token.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
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
	* @apiParam {String} friends Member Social Friends [ ex) socialId01,socialId02,socialId03,...  ].
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
	* @apiSuccess {String} data.socialId  Member Social ID.	
	* @apiSuccess {String} data.nickname  Member Nickname.	
	* @apiSuccess {String} data.profileImageUrl  Member Profile Image URL.	
	* @apiSuccess {Int} data.spearCount  Member Spear Count.	
	* @apiSuccess {Int} data.spearRemainTime  Member Spear Remain Time.	
	* @apiSuccess {String} data.title  Member 칭호.	
	* @apiSuccess {Int} data.teamIndex  Member Team Index.	
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	     "resultCode": 1,
	*	     "resultMessage": "성공",
	*	   	 "data": {
	*	        "socialId": "12345678913",
	*	        "nickname": "doogoon",
	*	        "profileImageUrl": "",
	*	        "spearCount": 5,
	*	        "title": "시민",
	*	        "teamIndex": 1
	*	        "spearRemainTime": 0
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
	* @apiParam {String} nickname Member Nickname.	
	* @apiParam {String} profileImageUrl Member Profile Image URL.	
	* @apiParam {String} pushToken Member Push Token.	
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {String} data.socialId  Member Social ID.	
	* @apiSuccess {String} data.nickname  Member Nickname.	
	* @apiSuccess {String} data.profileImageUrl  Member Profile Image URL.	
	* @apiSuccess {Int} data.spearCount  Member Spear Count.	
	* @apiSuccess {Int} data.spearRemainTime  Member Spear Remain Time.	
	* @apiSuccess {String} data.title  Member 칭호.	
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
	*	        "socialId": "12345678913",
	*	        "nickname": "doogoon01",
	*	        "profileImageUrl": "",
	*	        "spearCount": 5,
	*	        "title": "시민",
	*	        "teamName": "RED",
	*	        "teamImageUrl": "http://54.178.134.74/files/red_team.jpg",
	*	        "spearRemainTime": 0
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



/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//								Member Profile Image Upload									   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {post} /file_upload 회원 프로필 사진 업로드
	* @apiName 회원 프로필 사진 업로드
	* @apiGroup Member
	*
	*
	* @apiParam {Binary} file Member Profile Image File Name.		
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "resultCode": 1,
	*	    "resultMessage": "성공",
	*	    "data": {
	*	        "file_url": "http://54.178.134.74/files/0000000009.jpg"
	*	    }
	*	}
	*
	*/	

