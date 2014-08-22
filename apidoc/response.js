/////////////////////////////////////////////////////////////////////////////////////////////////
//																							   //
//									Error Case												   //
//																							   //
/////////////////////////////////////////////////////////////////////////////////////////////////	

	/**
	* @api {post} / 응답 CASE
	* @apiName 응답 CASE
	* @apiGroup Response
	*
	*
	* @apiErrorExample Server OK-Response:
	*     HTTP/1.1 200 Server OK
	*     {
	*        "resultCode": 1,
	*	     "resultMessage": "성공"
	*     }
	* @apiErrorExample Server Error-Response:
	*     HTTP/1.1 500 Server Error
	*     {
	*        "resultCode": 10,
	*	     "resultMessage": "서버 오류"
	*     }
	* @apiErrorExample Parameter Error-Response:
	*     HTTP/1.1 400 Parameter Error
	*     {
	*        "resultCode": 11,
	*	     "resultMessage": "파라미터 오류"
	*     }
	* @apiErrorExample Duplicate Error-Response:
	*     HTTP/1.1 400 Duplicate Error
	*     {
	*        "resultCode": 12,
	*	     "resultMessage": "중복"
	*     }
	* @apiErrorExample NOTFOUND Error-Response:
	*     HTTP/1.1 400 NOTFOUND Error
	*     {
	*        "resultCode": 13,
	*	     "resultMessage": "조회 결과 없음"
	*     }
	* @apiErrorExample NOTMATCH Error-Response:
	*     HTTP/1.1 400 NOTMATCH Error
	*     {
	*        "resultCode": 14,
	*	     "resultMessage": "조회 결과 맞지 않음"
	*     }
	* @apiErrorExample FAIL Error-Response:
	*     HTTP/1.1 500 FAIL Error
	*     {
	*        "resultCode": 15,
	*	     "resultMessage": "실패"
	*     }
	*/



