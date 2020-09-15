$(document).ready(function(){
	$('#createNewSurvey').on('click',handleNewServey);
	$('#closeAddSurveyModal').on('click',handleCloseModal)
	$('#addMoreSurveyForm').on('click',renderMoreForms);
	$('#saveNewSurey').on('click',handleSaveNewSurvey);
	$('#moreSurveyFormHolder').empty();
	dynamicIdMap = [];
	optionArr = [];
	setTimeout(function(){
		getAllSurvey()
	},200)
});

function getAllFormInfo(){
	if(dynamicIdMap && dynamicIdMap.length>0){
		var allFormArr = [];
		for(var i of dynamicIdMap){
			var options = []
			var obj = {}
			obj.surveyQuestion = $('#surveyQuestion_'+i).val();
			obj.answerType = $('#surveyAnswerType_'+i).val();
			if(!obj.surveyQuestion || !obj.answerType){
				return false;
				break
			}
			obj.id = i;
			if(optionArr && optionArr.length>0){
				for(var key in optionArr){
					if(optionArr[key].formId == i ){
						options.push(optionArr[key]);
					}
				}
				obj.options = options;
			}
			else{
				return false;
				break;
			}
			allFormArr.push(obj);
		}
		return allFormArr
	}
	else{
		return false;
	}
}

function handleSaveNewSurvey(){
	var formData = getFormData();
	if(!formData){
	 	alert("Please Fill Form Correctly");
	 	return;
	}
	$.ajax({
      	type: "post",
      	url: "/newsurvey",
      	dataType: 'json',
      	data: formData,
      	success: function(data) {
        	console.log('process sucess',data);
        	console.log('--------- saved success fully----')
        	handleCloseModal();
        	window.location.reload()
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('login error',e);
      	},
    });
	 console.log('----',formData)
}

function getFormData(){
	var formsInfo = getAllFormInfo();
	if(formsInfo && formsInfo.length>0){
		var obj  = {
			surveyName : $('#newSurveyName').val(),
			surveyAmount : $('#newSurveyGiftAmount').val(),
			formsInfo: formsInfo
		}
		return obj
	}
	else{
		return false;
	}
}

function handleCloseModal(){
	$('#newSurveyName').val('');
	$('#newSurveyGiftAmount').val('');
	$('#moreSurveyFormHolder').empty();
	dynamicIdMap = [];
	optionArr = [];
	$('#createNewSurveyModal').modal("hide");
}

function handleNewServey(){
	$('#moreSurveyFormHolder').empty();
	renderMoreForms();
	$('#createNewSurveyModal').modal("show");
}

function generateNewId(){

	var newId = Date.now()+Math.floor(Math.random()*100)+new Date().getMilliseconds()+3434213;
	return newId
}

function renderMoreForms(){
	var newId = generateNewId();
 	$("#moreSurveyFormHolder").append(initialiseTmpl({newId:newId}));
 	dynamicIdMap.push(newId);
 	$('#surveyAnswerType_'+newId).on("change",handleAnswerTypeChange)
 	$('#addAnsOption_'+newId).on("click",handleAnswerOptions)
 	$('#removeForm_'+newId).on("click",handleRemoveForm)
}

function handleRemoveForm(){
	var id = this.id.split('_')[1];
	$('#newSurveyDynamicForm_'+id).remove();
	dynamicIdMap = dynamicIdMap.filter((each)=>{
		return each != id;
	});
}

function handleAnswerOptions(){
	console.log(this.id);
	var id = this.id.split('_')[1];
	var option = $('#addOptions_'+id).val();
	if(option){
		var index = optionArr.findIndex((eachElement,index)=>{
			if(eachElement.formId == id){
				if(eachElement.option == option){
					return eachElement;
				}
			}
		});
		if(index !== -1){
		}
		else{
			var newObj  = {option:option,id:generateNewId(),formId:id}
			optionArr.push(newObj);
		}
		$("#addAnsOptionsHldr_"+id).empty()
		for(var key in optionArr){
			if(optionArr[key].formId == id){
				var obj  ={option:optionArr[key].option,id:optionArr[key].id}
				$("#addAnsOptionsHldr_"+id).append(renderOptionAnsTemplate(obj));
				$('#removeOption_'+optionArr[key].id).on('click',handleRemove);
			}
		}
		$('#addOptions_'+id).val('')
	}
}

function handleRemove(){
	var id = this.id.split('_')[1];
	$('#pptionfrgHldr_'+id).remove();
	var newArr = optionArr.filter((eachOption)=>{
		return eachOption.id != id;
	});
	optionArr = newArr
}

function handleAnswerTypeChange(){
	var val = this.value;
	var id = this.id.split('_')[1];
	$('#addAnsOptions_'+id).removeClass('hidden')
	console.log(this.value,this.id)
}


function gettmpl() {
  return `
  	<div id="newSurveyDynamicForm_{{newId}}" class="">
  	<span class="dynamicFormCls" title="Remove Form" id="removeForm_{{newId}}"></span>
	  	<div class="form-group">
		    <label for="surveyQuestion_{{newId}}">Enter Question</label>
		    <input type="text" class="form-control" id="surveyQuestion_{{newId}}" placeholder="Enter Your Question" name="surveyQuestion_{{newId}}">
		</div>
		<div class="form-group">
		    <label for="surveyAnswerType_{{newId}}">Select Answer Field Type</label>
		    <select class="form-control" id="surveyAnswerType_{{newId}}">
		    	<option value="">Select</option>
		    	<option value="checkbox">Check Box</option>
		    	<option value="radio">Radio Button</option>
		    </select>
		</div>
		<div class="form-group hidden" id="addAnsOptions_{{newId}}">
		    <label for="addOptions_{{newId}}">Enter Options</label>
		    <input type="text" class="form-control addAnsOptionsCls" id="addOptions_{{newId}}" placeholder="Add Options" name="addOptions">
			<span id="addAnsOption_{{newId}}" class="addAnsOptionsIconCls" title="add Options"></span>
		</div>
		<span id="addAnsOptionsHldr_{{newId}}"></span>
	</div>
  `;
}

function initialiseTmpl(eachData) {
  var template = Handlebars.compile(gettmpl());
  var d = template(eachData);
  return d;
}

function renderOptionAnsTemplate(eachData) {
  var template = Handlebars.compile(compileOptions());
  var d = template(eachData);
  return d;
}

function compileOptions(){
	  return `
  		<span id="pptionfrgHldr_{{id}}">
  		<span>{{option}}</span>
  		<span id="removeOption_{{id}}" class="removeOptionCls"></span>
  		</span>
  	`;
}

function getAllSurvey(){
	$.ajax({
      	type: "get",
      	url: "/survey",
      	dataType: 'json',
      	data: '',
      	success: function(data) {
        	renderAllSurvey(data.allSurvey);
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('login error',e);
      	},
    });
}

function renderAllSurvey(allSurvey){
	$('#allSurveyHolder').empty()
	if(allSurvey && allSurvey.length>0){
		for(var key in allSurvey){
			$('#allSurveyHolder').append(getAllSurveyTemplate(allSurvey[key]));
		}
	}
	else{
		$('#allSurveyHolder').append(getAllSurveyTemplate({surveyName:"No Survey Added"}));
	}
}

function compileSurveyTmpl() {
  return `
  <tr  id="eachSurvey_{{_id}}" class="allSurveyCls">
    <td>{{surveyName}}</td>
    <td>₹ {{surveyAmount}}</td>

  </tr>
  `;
}

function getAllSurveyTemplate(eachSurvey){
	var template = Handlebars.compile(compileSurveyTmpl());
  	var d = template(eachSurvey);
  	return d;
}

