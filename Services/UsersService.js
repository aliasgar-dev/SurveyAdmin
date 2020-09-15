module.exports = function UsersService(instance){

	var self = this
	,	distributedMongo = null
	,	mongodb = require('mongodb')
	;

	function initialise(cb){

		getMongoDBService();

		function getMongoDBService(){
			instance.getService("MongoDBService",(err,service)=>{
				if(err){
					cb(err,null);
					return;
				}
				distributedMongo = service
				cb(null,true);
			})
		}
	}

	function registerAdmin(data,cb){
		distributedMongo.save("AdminAccount",data,cb);
	}

	function loginUser(userInfo,cb){

	}


	this.initialise = initialise;
	this.loginUser = loginUser;
	this.registerAdmin = registerAdmin;
}