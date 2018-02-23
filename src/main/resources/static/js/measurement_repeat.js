var taskId;
var collectedData;
var errorMessage;
$(document).ready(function() {

	checkSystemState();
	
	var name = getURLParameter('name');
	errorMessage = getURLParameter('errorMessage');
	$(".page-title-name").append(name);
	
	taskId = getURLParameter('taskId');
	var collectedDataId = getURLParameter('collectedDataId');

	
	/* if(you_have_permission && !data_collector){ */

	/*
	 * } else window.location.href = "pages-error-401.html";
	 */

	getMeasureTaskAndCollectedData(taskId, collectedDataId);
});

// Get measure task 
function getMeasureTaskAndCollectedData(taskId, collectedDataId) {

	var data = {
		'taskId' : taskId,
		'collectedDataId' : collectedDataId
	};

	$.ajax({
		url : getPhase4URL() + '/measurement-repeat/',
		type : 'get',
		contentType : "application/json; charset=utf-8",
		data : data,
		success : function(response) {

			collectedData = response.collectedData;
			$('#error_message').find('p').append(errorMessage);  //+". Value added previously is "+collectedData.value);

			$('#means').val(response.measureTask.means);
			$('#source').val(response.measureTask.source);

			$('#label_metric').text(response.measureTask.metric.name);
			
			if(response.measureTask.metric.hasUserDefinedList) {
				$.each(response.measureTask.metric.userDefinedList, function(key, value) {
				     $('#user_defined_list')
				         .append($("<option></option>")
				         .attr("value",key)
				         .text(value));
				});
				$('#user_defined_list').css('display', 'block');
			}
			else {
				$('#value').css('display', 'block');
			}
		},
		error : function(response) {
			$('#result').find('p').html('<br><b>'+response.message+'</b>').css('color','#DF0101');
		}
	});
}

//Collect data to repeat 
function repeatMeasure() {

	var collected_data = {};
	var workflowData = {};
	
	//Prepare collected data to send
	collected_data._id = collectedData._id;
	collected_data.workflowData = collectedData.workflowData;
	collected_data.taskId = collectedData.taskId;
	collected_data.value = $('#value').val();
	collected_data.validated = false;
	
	$.ajax({
		url : getPhase4URL() + '/measurement-repeat/?runtimeTaskId='+taskId,
		type : 'post',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(collected_data),
		success : function(response) {		
			$('#result').find('p').html('<br><b>'+response+'</b>').css('color','##1caf9a');
		},
		error : function(response) {
			$('#result').find('p').html('<br><b>'+response.message+'</b>').css('color','#DF0101');
		}
	});
}