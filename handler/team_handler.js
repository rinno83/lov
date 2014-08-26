var crypto 			= require("crypto"),
	mysql_manager	= require('../handler/mysql_handler');

exports.selectTeam = function(memberIndex){
	mysql_manager.getTeamInfo(function(err, mysqlResult){
		if(err)
		{
			throw err;
		}
		else
		{
			
		}
	});
};
