/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Team Info												   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /team/info 팀 정보
	* @apiName 팀 정보
	* @apiGroup Team
	*
	*
	* @apiSuccess {Object[]} data  Result Data.
	* @apiSuccess {Int} data.teamIndex  Team Index.
	* @apiSuccess {String} data.teamName  Team Name.
	* @apiSuccess {Int} data.teamConquerCount  Team Conquer Land Count.
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	  {
	*	    "resultCode": 1,
	*	    "resultmessage": "성공",
	*	    "data": [
	*	        {
	*	            "teamConquerCount": 2,
	*	            "teamIndex": 1,
	*	            "teamName": "BLUE"
	*	        },
	*	        {
	*	            "teamConquerCount": 1,
	*	            "teamIndex": 2,
	*	            "teamName": "RED"
	*	        }
	*	    ]
	*	}
	*
	*/





/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Member Ranking											   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {get} /team/rank 팀내 회원 랭킹
	* @apiName 팀내 회원 랭킹
	* @apiGroup Team
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
