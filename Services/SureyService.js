module.exports = function SureyService(instance){

	var self = this
	,	distributedMongo  = null
	,	mongodb = require('mongodb')
	;

	function initialise(cb){

		getMongoService();

		function getMongoService(){
			instance.getService("MongoDBService",function(err,service){
				if(err){
					cb(err,null);
					return;
				}
				distributedMongo = service;
				cb(null,true);
			});
		}
	}
	function getAllSurvey(cb){
		distributedMongo.find("NewSurvey",{},{},cb)
	}

	function saveNewSurvey(data,cb){
		distributedMongo.save("NewSurvey",data,cb)
	}

	function getAllSurveyAndAnswers(cb){

		var allSurveyInfo = {};
		function getAllSurveyQuestions(){

			distributedMongo.find("NewSurvey",{},{},(err,allSurveys)=>{
				if(err){
					console.log('--error while getting allSurveys-',err);
					cb(err,null);
					return
				}
				if(allSurveys){
					allSurveyInfo.allSurveys = allSurveys;
					getAllAnswers()
				}
				else{
					cb(null,allSurveyInfo);
				}
			});
		}

		function getAllAnswers(){

			distributedMongo.find("SurveyResponce",{},{},(err,allAnswers)=>{
				if(err){
					console.log('--error while getting getting AllAnswers----',err);
					cb(err,null);
					return;
				}
				if(allAnswers){
					allSurveyInfo.allAnswers = allAnswers;
					cb(null,allSurveyInfo);
				}
				else{
					cb(null,allSurveyInfo);
				}
			});
		}

		getAllSurveyQuestions()
	}

	this.initialise = initialise;
	this.saveNewSurvey = saveNewSurvey;
	this.getAllSurvey = getAllSurvey;
	this.getAllSurveyAndAnswers = getAllSurveyAndAnswers
}