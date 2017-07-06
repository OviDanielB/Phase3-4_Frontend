var taskId;
$(document).ready(function() {

	checkSystemState();
	
	var name = getURLParameter('name');
	$(".page-title-name").append(name);
	
	taskId = getURLParameter('taskId');
	runtimeTaskId = getURLParameter('runtimeTaskId');

	/* if(you_have_permission && !data_collector){ */

	/*
	 * } else window.location.href = "pages-error-401.html";
	 */

	getMeasureTask(taskId);
});

// Get measure task 
function getMeasureTask(taskId) {

	var data = {
		'taskId' : taskId,
		'runtimeTaskId' : runtimeTaskId 
	};

	$.ajax({
		url : getPhase4URL() + 'measurement-collection/',
		type : 'get',
		contentType : "application/json; charset=utf-8",
		data : data,
		success : function(measureTask) {
			

			$('#means').val(measureTask.means);
			$('#source').val(measureTask.source);
			$('#label_metric').text(measureTask.metric.name);

			if(measureTask.metric.hasUserDefinedList == true) {
				$.each(measureTask.metric.userDefinedList, function(key, value) {
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

//Collect data
function collectMeasure() {

	var collected_data = {};
	var workflowData = {};
	
	//Prepare collected data to send
	collected_data.workflowData = workflowData;
	collected_data.taskId = taskId;
	collected_data.value = $('#value').val();
	collected_data.validated = false;

	
	$.ajax({
		url : getPhase4URL() + 'measurement-collection?runtimeTaskId='+runtimeTaskId,
		type : 'post',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(collected_data),
		success : function(response) {		
			$('#result').find('p').html('<br><b>'+response+'</b>').css('color','##1caf9a');
		},
		error : function(response) {
			var error = $.parseJSON(response.responseText);
			$('#result').find('p').html('<br><b>'+error.errorCode + " - "+error.message+'</b>').css('color','#DF0101');
		}
	});
}