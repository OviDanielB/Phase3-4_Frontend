$(document)
		.ready(
				function() {
					checkSystemState();

					goToDeployBusinessWorkflow();

					var modelId = getURLParameter("modelId");
					var name = getURLParameter('name');
					$(".page-title-name").append(name);
					checkIfDeployed(modelId);
					
				});

function deployModelAjaxCall() {
	var modelId = getURLParameter("modelId");

	if (modelId == null) {
		document.getElementById('errorPanelDiv').innerHTML = "The modelId is null!";
		document.getElementById("errorDiv").style.display = "block";
	} else {

		$
				.ajax({
					type : "POST",
					url : getPhase3URL() + "/workflows/deployments",
					data : JSON.stringify({
						'modelId' : modelId
					}),
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					success : function(response) {
						document.getElementById('successPanelDiv').innerHTML = response.businessWorkflowProcessDefinitionId;
						document.getElementById("successDiv").style.display = "block";

					},
					error : function(err) {
						var json_obj = $.parseJSON(err.responseText);
						if (!json_obj.errorCode || !json_obj.message) {
							document.getElementById('errorPanelDiv').innerHTML = "Expired timeout interval";
						} else {
							document.getElementById('errorPanelDiv').innerHTML = json_obj.errorCode + " "+
									+ json_obj.message;
						}
						document.getElementById("errorDiv").style.display = "block";

					}
				});
	}
}

function DeployButton() {
	if (document.getElementById('checkboxModel').checked) {
		document.getElementById('checkboxModel').disabled = true;
		deployModelAjaxCall();
	}
}

function checkIfDeployed(modelId) {
	if (modelId == null) {
		document.getElementById('errorPanelDiv').innerHTML = "The modelId is null!";
		document.getElementById("errorDiv").style.display = "block";
	} else {

		$
				.ajax({
					type : "GET",
					url : getPhase3URL() + "/workflows/" + modelId + "/process-definition-id",
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					success : function(response,textStatus, xhr) {
						if(xhr.status == 204){
						    //not deployed yet, nothing to do
							//document.getElementById('successPanelDiv').innerHTML = "The process definition is not deployed yet! You can deploy it!";
							 //document.getElementById("successDiv").style.display = "block";
						}
						else if(xhr.status == 200){
							document.getElementById('checkboxModel').disabled = true;
							document.getElementById('errorPanelDiv').innerHTML = "The process definition"+ response.businessWorkflowProcessDefinitionId +"was already deployed!";
							document.getElementById("errorDiv").style.display = "block";
						}

					},
					error : function(err,xhr) {
						if(xhr.status == 204){
							document.getElementById('successPanelDiv').innerHTML = "The process definition is not deployed yet! You can deploy it!";
							document.getElementById("successDiv").style.display = "block";
							}

					}
				});
	}
	
}

function goToDeployBusinessWorkflow() {

    var keyName = getURLParameter('name');

    if (keyName == null) {
        document.getElementById('errorPanelDiv').innerHTML = "The workflowName is null!";
        document.getElementById("errorDiv").style.display = "block";
    } else {
        $.ajax({
            url: getPhase3URL() + "/activiti/instances?processDefinitionKey=" + keyName + "_workflow_handler",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (response, textStatus, xhr) {
                console.log(response);
                var res = JSON.parse(JSON.stringify(response));
                processDefinitionId = res.processDefinitionId;
                console.log(processDefinitionId);
                $.ajax({
                    type: "POST",
                    url: getPhase3URL() + "/workflows/complete-task",
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify({
                        'processDefinitionId' : processDefinitionId,
                        // word contained only in the name of the task to complete
                        'taskToComplete': "model"
                    }),
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        document.getElementById('successPanelDiv').innerHTML = response.businessWorkflowProcessInstanceId;
                        document.getElementById("successDiv").style.display = "block";
                    },
                    error: function (err) {
                        var json_obj = $.parseJSON(err.responseText);
                        if (!json_obj.errorCode || !json_obj.message) {
                            document.getElementById('errorPanelDiv').innerHTML = "Expired timeout interval";
                        } else {
                            document.getElementById('errorPanelDiv').innerHTML = json_obj.errorCode
                                + json_obj.message;
                        }
                        document.getElementById("errorDiv").style.display = "block";
                    }
                });
            }
        });
    }
}


// TODO add onclick action for button at the end of metaworkflow
function exportWorkflow() {
	var modelId = getURLParameter('modelId');

    if (modelId == null) {
        document.getElementById('errorPanelDiv').innerHTML = "The modelId is null!";
        document.getElementById("errorDiv").style.display = "block";
    } else {
    	location.href = getPhase3URL() + '/models/export.html?=modelId' + modelId;
    }
}