$(document).ready(function() {responseList.getTotal()
	
	checkSystemState();
	var name = getURLParameter('name');
	var modelId = getURLParameter('modelId');
	$(".page-title-name").append(name);
	
	/*if(you_have_permission && !measurement_plan){*/
		getWorkflowImage(modelId);
		getMetricAndTasks(modelId);
	/*}
	else
		window.location.href = "pages-error-401.html";*/

});

//Retrieve workflow images
function getWorkflowImage(modelId){
	
	 	$('#workflow_image').prepend('<img id="workflow_image_src" src="' + getPhase3URL() + 'measurement-plan/image?modelId=' + modelId + '" />')

}

var flowElements;
var metrics;
var groups;
var workflowData;

//Fill every row with a task, all metrics and all groups
function getMetricAndTasks(modelId){
	
	var data = {'modelId' : modelId};
	$.ajax({
		url: getPhase3URL() + 'measurement-plan',
		type: 'get',
		contentType : "application/json; charset=utf-8",
		data: data,
		success: function(response){ 

			console.log(response);
			
			flowElements = response.flowElements;
			metrics = response.metrics;
			groups = response.gropus;
			workflowData = response.workflowData;


			//for each row fill with all metrics, all groups, source and means
			$.each(flowElements, function(key, val){
				
			 	var newRow = $('#default').clone().attr('id', 'row'+val.id);			
				$('#attach_metric_row').append(newRow);


				//Fill metrics
				addMetrics(response.metrics, val.id);
				//Fill groups
				addGroups(response.groups, val.id);
		    
				//Fill tasks
				$('#row'+val.id).find('h4').text(val.name);
				$('#row'+val.id).find('p').text(val.documentation);

				$('#means').attr('id', 'means'+val.id);	
				
				$('#source').attr('id', 'source'+val.id);	

			
				if(workflowData != null){
					$.each(workflowData.measureTasksList, function(k, v){
						
						var name = v.metric.name;
						var responsible = v.responsible;
						var means = v.means;
						var source = v.source;
					
						if(val.id == v.taskId){
							//Fill source
							//$('#row'+v.taskId).find('input').val(v.source).prop('disabled', true);

							$("#source").val(source);
							$("#old_source").attr('id', 'old_source'+v.taskId).val(source);
							$("#old_means").attr('id', 'old_means'+v.taskId).val(means);
							$("#old_metric").attr('id', 'old_metric'+v.taskId).val(name);
							$('#old_group').attr('id', 'old_group'+v.taskId).val(responsible);

							$('#old_metric'+v.taskId).show().prop('disabled', true);
							$('#old_group'+v.taskId).show().prop('disabled', true);
							$('#old_means'+v.taskId).show().prop('disabled', true);
							$('#old_source'+v.taskId).show().prop('disabled', true);
							$("#metric"+v.taskId).hide();
							$("#group"+v.taskId).hide();
							$("#means"+v.taskId).hide();
							$("#source"+v.taskId).hide();
						}
					});

					$('#button_save').hide();
					$('#button_edit').show();

				}
				else{
					$('#old_metric'+val.id).hide();
					$('#old_group'+val.id).hide();
					$('#old_means'+val.id).hide();
					$('#old_source'+val.id).hide();
					$('#old_metric').hide();
					$('#old_group').hide();
					$('#old_means').hide();
					$('#old_source').hide();
					$("#metric"+val.id).show();
					$("#group"+val.id).show();
					$("#means"+val.id).show();
					$("#source"+val.id).show();

					$('#button_edit').hide();

				}

			});
			
			 $('#default').hide();
			
		},
		error: function(err){
			var error = $.parseJSON(err.responseText);
			alert(error.errorCode + " "+ error.message);
		}
	});
}


//Add metrics in select metric
function addMetrics(metrics, id){
	
	var select = $('#row'+id).find("#metric").attr('id', 'metric'+id);
	select.append('<option id="-1">Any metric</option>');


	//iterate over the data and append a select option
	$.each(metrics, function(key, metric){
		select.append('<option id="' + metric.id + '">' + metric.name +'</option>');
		
	});
	
}

//Add groups in select group
function addGroups(groups, id){
	
	var select = $('#row'+id).find("#group").attr('id', 'group'+id);            

	//iterate over the data and append a select option
	$.each(groups, function(key, group){
		select.append('<option id="' + group.id + '">' + group.name +'</option>');

	});
}

//Send strategy to back-end with metric, group and mean association
function saveTasks(){
	
	var allRow = $('#attach_metric_row').find('.row');

	//json objects initialization
	var measureTasksList = [];
	var strategy = {};
	
	$.each(allRow, function(key, row){
		var id_task = this.id.substring(3);
		var id_metric = $('#metric'+id_task).find(":selected").attr('id');
		var metric;

		if(id_metric != -1){
			
			//get metric object by selected id
			$.each(metrics, function(k, m){
				if(m.id == id_metric)
					metric = m;
			});
			console.log($('#source'+id_task).val());
			measureTasksList.push({
		        taskId: id_task,
		        metric: metric,
		        means: $('#means'+id_task).find(":selected").text(),
		        responsible: $('#group'+id_task).find(":selected").text(),
		        source: $('#source'+id_task).val(),
		    });
		}

	});
	if(jQuery.isEmptyObject(measureTasksList)){
		alert("Nothing metric is selected. Please choose almost one.");
	}
	else{
		strategy.businessWorkflowModelId =  getURLParameter('modelId');
		strategy.measureTasksList = measureTasksList;
		
		$.ajax({
			 url: getPhase3URL() + 'measurement-plan',
			 type: 'post',
			 contentType : "application/json; charset=utf-8",
			 data: JSON.stringify(strategy),
			 success: function(response){ 
				 
				 alert(response);
				 //disable button
				 $("#button_save").prop("disabled",true);
				 //disable all elements in attach_metric_row (there are all tasks, metrics, ...)
				 $('#attach_metric_row').find('*').prop('disabled', true);

			  },
			  error: function(err){
			  	console.log(err);
					var error = $.parseJSON(err.responseText);
					alert(error.errorCode + " "+ error.message);
			  }
		 });	
		 //disable all elements in attach_metric_row (there are all tasks, metrics, ...)
		 $('#attach_metric_row').find('*').prop('disabled', true);

	}
}

function editTasks(){

	$('#button_save').show();
	$('#button_edit').hide();

	var allRow = $('#attach_metric_row').find('.row');

	$.each(allRow, function(key, row){

		var id_task = this.id.substring(3);
		$('#old_metric'+id_task).hide();
		$('#old_group'+id_task).hide();
		$('#old_means'+id_task).hide();
		$('#old_source'+id_task).hide();
		$("#metric"+id_task).show();
		$("#group"+id_task).show();
		$("#means"+id_task).show();
		$("#source"+id_task).show();
		var metric = $('#old_metric'+id_task).val();
		console.log(metric);
		//$("#metric"+id_task+"option:selected").val(metric);
		$('#metric'+id_task+' option[value="'+metric+'"]').attr("selected", "selected");
		console.log($('#metric'+id_task+' option[value="'+metric+'"]').val());

		//$('#metric'+id_task+'option:contains('+metric+')').prop('selected', true);

	});
}