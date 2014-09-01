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

