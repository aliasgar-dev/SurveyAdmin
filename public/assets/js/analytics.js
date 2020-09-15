$(document).ready(function(){
	
	setTimeout(function(){
		// getAllSubmittedSurvey()
	},200)
});

function getAllSubmittedSurvey(){
	$.ajax({
      	type: "get",
      	url: "/submitted-survey",
      	dataType: 'json',
      	data: '',
      	success: function(data) {
      		console.log('--sdsewdesc',data)
        	// renderAllSubmittedSurvey(data);
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('login error',e);
      	},
    });
}

function renderAllSubmittedSurvey(data){
	// $('#analyticsDataHolder').empty()
	// if(data){
	// 	if(data && data.allSurveys){
	// 		for(var key in data.allSurveys){
	// 			$('#analyticsDataHolder').append(getAllSurveyTemplate(data.allSurveys[key]));
	// 			var questionsObj  = data.allSurveys[key].formsInfo;
	// 		}
	// 		for(var i in questionsObj){
	// 			var obj = {};
	// 			obj.questionName = questionsObj[i].surveyQuestion;
	// 			obj._id = data.allSurveys[key]._id;
	// 			$('#questionHldr_'+data.allSurveys[key]._id).append(getAllQuestionTemplate(obj));
	// 			// $('#eachSurvey_'+data[key]._id).on('click',handleGetSurveyById)
	// 			for(var j in questionsObj[i].options ){
	// 				$('#surveyAnswerHldr_'+data.allSurveys[key]._id).append(getAllAnswerTemplate(questionsObj[i].options[j]));
	// 			}
	// 		}
	// 	}
	// 	if(data && data.allAnswers){
	// 		for(var i in data.allAnswers)
	// 		$('#totalUsersRespond').append(getAllUsersTemplate(data.allAnswers[i]));
	// 	}
	// }
	// else{
	// 	$('#analyticsDataHolder').append(getAllEmptyTemplate({msg:"No Reward Added"}));
	// }
}

// function compileRewardTmpl() {
//   return `
//   <div class="card analyticsCardsCls">
//     <div class="card-body text-center">
//     	<h3>Survey Name</h3>
//       	<p class="card-text">{{surveyName}}</p>
//       	<div id="questionHldr_{{_id}}" class=""></div>
//     </div>
//   </div>
//   `;
// }

// function getAllSurveyTemplate(eachReward){
// 	var template = Handlebars.compile(compileRewardTmpl());
//   	var d = template(eachReward);
//   	return d;
// }

// function compileEmptyTmpl() {
//   return `
//   <tr  id="eachReward_{{_id}}" class="allSurveyCls" style="text-align:center;">
//     <td>{{msg}}</td>
   
//   </tr>
//   `;
// }

// function compileQuestionTmpl(){
// 	return `
// 	  <div  id="eachQuestion_{{_id}}" class="" style="text-align:center;">
// 	  <div class= "eachQuestionCls">Question Name</div>
// 	   <div style="text-align: justify;">{{questionName}}?</div>
// 	   <div id="surveyAnswerHldr_{{_id}}"></div>
// 	  </div>
//   `;
// }

// function compileAnswerTmpl(){
// 	return `
// 	  <div  id="eachAnswer_{{_id}}" class="" style="text-align:center;">
// 	   <div style="text-align: justify;">{{option}}</div>
// 	  </div>
//   `;
// }

// function getAllQuestionTemplate(eachQuestion){
// 	var template = Handlebars.compile(compileQuestionTmpl());
//   	var d = template(eachQuestion);
//   	return d;
// }

// function getAllAnswerTemplate(eachAnswer){
// 	var template = Handlebars.compile(compileAnswerTmpl());
//   	var d = template(eachAnswer);
//   	return d;
// }

// function getAllEmptyTemplate(eachReward){
// 	var template = Handlebars.compile(compileEmptyTmpl());
//   	var d = template(eachReward);
//   	return d;
// }

// function getAllEmptyTemplate(eachReward){
// 	var template = Handlebars.compile(compileEmptyTmpl());
//   	var d = template(eachReward);
//   	return d;
// }
