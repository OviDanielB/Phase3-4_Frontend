$( document ).ready(function() {
	checkSystemState();
	$('#buttonComplete').on("click", function() {
		window.location.href = getUrlFrontEnd();
	});
	
	var processDefinitionId = getURLParameter('processDefinitionId');

    $.ajax({

        url: getPhase3URL() + "/validation/measureTasks?businessWorkflowProcessDefinitionId="+
        processDefinitionId

    }).then(function(response) {
    	jsonData= JSON.parse(JSON.stringify(response));
    	var data = jsonData.metricTask;

    	console.log(data);

    	for(var i in data) {

    		if(data[i].newVersion == true){
                var $tr = $('<tr onclick="window.location.href =\'' + getUrlFrontEnd() + '/validationop-list.html?processDefinitionId=' +
                    processDefinitionId + '&taskId=' + (data[i].idTask) + '&measureName=' + data[i].ontology.measurementModel.name + '\';" style="cursor: pointer;">').append(
                    $('<td>').text(data[i].ontology.measurementModel.name),
                    $('<td>').text(data[i].ontology.measurementModel.metricType),
                    $('<td>').text(data[i].ontology.measurementModel.description)
                );
                $tr.appendTo("#measureTable");
                console.log($tr.html());
			}else {
                var $tr = $('<tr onclick="window.location.href =\'' + getUrlFrontEnd() + '/validationop-list.html?processDefinitionId=' +
                    processDefinitionId + '&taskId=' + (data[i].idTask) + '&measureName=' + data[i].nameTask + '\';" style="cursor: pointer;">').append(
                    $('<td>').text(data[i].nameTask),
                    $('<td>').text(data[i].nameMetric),
                    $('<td>').text(data[i].descriptionMetric)
                );
                $tr.appendTo("#measureTable");
                console.log($tr.html());
            }
    	}

    });
});
