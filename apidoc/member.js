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
	* @apiSuccess {String} data.introduce  Member 소개글.	
	* @apiSuccess {Int} data.spearCount  Member Spear Count.	
	* @apiSuccess {Int} data.spearRemainTime  Member Spear Remain Time.	
	* @apiSuccess {String} data.title  Member 칭호.	
	* @apiSuccess {Int} data.teamIndex  Member Team Index.	
	* @apiSuccess {Int} data.conquerCount  Member Conquer Land Count.	
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
	*	        "introduce": "안녕하세요. Heesu Kim입니다.",
	*	        "spearCount": 5,
	*	        "title": "시민",
	*	        "teamIndex": 1,
	*	        "conquerCount": 1,
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



/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member Ranking											   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /member/rank 전체 회원 랭킹
	* @apiName 전체 회원 랭킹
	* @apiGroup Member
	*
	*
	* @apiParam {Int} offset Ranking Offset [ Default : 0, Optional ]
	* @apiParam {Int} limit Ranking Limit [ Default : 10, Optional ]
	*
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.memberRank  회원 랭킹.
	* @apiSuccess {Int} data.memberConquerCount  회원 땅 정복 횟수.
	* @apiSuccess {Int} data.memberIndex  회원 Index.
	* @apiSuccess {String} data.nickname  회원 Nickname.
	* @apiSuccess {String} data.profileImageUrl  회원 프로필 사진 URL.
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "resultCode": 1,
	*	    "resultMessage": "성공",
	*	    "data": [
	*	        {
	*	            "memberRank": 1,
	*	            "memberConquerCount": 2,
	*	            "memberIndex": 10,
	*	            "nickname": "DooHwa Lee",
	*	            "profileImageUrl": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/t1.0-1/p50x50/10299076_678925182170293_3025102234137164045_n.jpg"
	*	        },
	*	        {
	*	            ...
	*	        }
	*	    ]
	*	}
	*
	*/	




/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member History											   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /member/history 회원 정복 히스토리
	* @apiName 회원 정복 히스토리
	* @apiGroup Member
	*
	*
	* @apiParam {Int} offset History Offset [ Default : 0, Optional ]
	* @apiParam {Int} limit History Limit [ Default : 20, Optional ]
	*
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.landIndex  땅 Index.
	* @apiSuccess {Int} data.nextConquerMemberIndex  자신 다음으로 해당 동을 점령한 회원 Index [ 0 : 자신 땅, else : 그 회원 땅 ].
	* @apiSuccess {Float} data.lat  회원 Latitude.
	* @apiSuccess {Float} data.lon  회원 Longitude.
	* @apiSuccess {Timestamp} data.registDate  회원 히스토리 작성 일시
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "resultCode": 1,
	*	    "resultMessage": "성공",
	*	    "data": [
	*	        {
	*	            "landIndex": "3516",
	*	            "nextConquerMemberIndex": 0,
	*	            "lat": "37.42343",
	*	            "lon": "127.342545",
	*	            "registDate": 1409762609535
	*	        },
	*	        {
	*	            ...
	*	        }
	*	    ]
	*	}
	*
	*/	

