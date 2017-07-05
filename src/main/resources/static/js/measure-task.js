$( document ).ready(function() {
	checkSystemState();
	$('#buttonComplete').on("click", function() {
		window.location.href = getUrlFrontEnd();
	});
	
	var processDefinitionId = getURLParameter('processDefinitionId');

    $.ajax({

        url: get3242Path() + get3242basePath() +"/validation/measureTasks?businessWorkflowProcessDefinitionId="+
        processDefinitionId

    }).then(function(response) {
    	jsonData= JSON.parse(JSON.stringify(response));
    	var data = jsonData.metricTask;

    	for(var i in data) {
            var $tr = $('<tr onclick="window.location.href =\''+getUrlFrontEnd()+'/validationop-list.html?processDefinitionId='+
            		processDefinitionId+'&taskId='+(data[i].idTask)+'&measureName='+data[i].nameTask+'\';" style="cursor: pointer;">').append(
                $('<td>').text(data[i].nameTask),
                $('<td>').text(data[i].nameMetric),
                $('<td>').text(data[i].descriptionMetric)
            );
            $tr.appendTo("#measureTable");
            console.log($tr.html());
    	}

    });
});
