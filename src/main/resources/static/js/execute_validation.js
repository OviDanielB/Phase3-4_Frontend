$( document ).ready(function() {
	checkSystemState();
	var taskId = getURLParameter('taskId');
	var runtimeTaskId = getURLParameter("runtimeTaskId");

	$('#buttonValidationOk').on("click", function() {
		saveValidation(taskId);
	});
	
	
    $.ajax({

        url: get3242Path() + get3242basePath() +"/validation/validationOpList?measureTaskId="+taskId +
        "&phase=PHASE_4"

    }).then(function(response) {
    	jsonData= JSON.parse(JSON.stringify(response));
    	
    	if(jsonData.length == 0) {
    		$('#groupValidationOk').show();
    	} else {
    		$.each(jsonData, function(i, item) {
            	
                var $tr = $('<tr onclick="window.location.href = \''+getUrlFrontEnd()+
                		'/validate.html?runtimeTaskId='+runtimeTaskId+'&taskId='+
                		taskId+"&validationId="+item.id+'\';" style="cursor: pointer;">').append(
                    $('<td>').text(item.name),
                    $('<td>').text(item.description),
                    $('<td>').text(item.type)
                );
                
                $tr.appendTo("#validationTable");
                console.log($tr.html());
            });
    	}
    });
	
});

/*
 * Il metodo saveValisation efettua il salvataggio di una validazione.
 */
function saveValidation(taskId) {
	
	$.ajax({
		'url' : get3242Path() + get3242basePath() + "/validation/completeValidation?taskId="
				+ taskId,
		'type' : 'get',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		
		success : function(response) {
			window.location.href = getUrlFrontEnd();
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}