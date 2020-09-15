$(document).ready(function(){
	$('#registerAdmin').on('click',handleRegisterAdmin)
});

function getRegisterFormData(){
	var obj = {
		name: $("#adminName").val(),
		username: $('#adminUserName').val(),
		password: $('#adminPassword').val(),
	}
	return obj;
}

function handleRegisterAdmin(){
	let isValid = validateForm();
	var data = getRegisterFormData();
	if(isValid){
		$.ajax({
	      	type: "post",
	      	url: "/register",
	      	dataType: 'json',
	      	data: data,
	      	success: function(data) {
	        	console.log('process sucess',data);
	        	console.log('--------- registered successfully----')
	        	clearRegisterForm();
	        	window.location.href = "/login"
	      	},
	      	error: function(e) {
	      		if(e && e.responseJSON && e.responseJSON.reason){
	      			alert(e.responseJSON.reason);
	      		}
	        	console.log('login error',e);
	      	},
	    });
	}
}
function clearRegisterForm(){
	$("#adminName").val('')
	$('#adminUserName').val('')
	$('#adminPassword').val('')
}

function validateForm() {
  	$("#admin-reg-form").validate({
	    rules: {
	      adminName: {
	        required: true,
	        minlength: 3
	      },
	      adminUserName: {
	        required: true,
	        minlength: 3,
	        maxlength: 32
	      },
	      adminPassword: {
	        required: true
	       
	      },
	    },
  	});
  	return $("#admin-reg-form").valid();
}