$(document)
		.ready(
				function() {
					checkSystemState();

					goToExportWorkflow();

					var name = getURLParameter('name');
					$(".page-title-name").append(name);
					document.getElementById('labelWorkflowExport').innerHTML = name;
					

				});

function exportModelAjaxCall() {

	var wfname = getURLParameter("name");
	var wfmodelId = getURLParameter("modelId");

	if (wfname == null || wfmodelId == null) {
		document.getElementById('errorPanelDiv').innerHTML = "The modelId is null!";
		document.getElementById("errorDiv").style.display = "block";
	} else {

		$
            .ajax({
					type : "POST",
					url : getPhase3URL() + "/bus/workflows",
					data : JSON.stringify({
						'name' : wfname,
						'modelId' : wfmodelId
					}),
					contentType : "application/json; charset=utf-8",
					success : function(response) {
						var name = getURLParameter('name');
						document.getElementById('successPanelDiv').innerHTML = "Workflow exported, the instance is "+name;
						document.getElementById("successDiv").style.display = "block";
					},
					error : function(err) {
						var json_obj = $.parseJSON(err.responseText);
						if (!json_obj.errorCode || !json_obj.message) {
							document.getElementById('errorPanelDiv').innerHTML = "Expired timeout interval";
						} else {
							document.getElementById('errorPanelDiv').innerHTML = json_obj.errorCode  + " "+
									+ json_obj.message;
						}
						document.getElementById("errorDiv").style.display = "block";

					}
				});
    }
}

function ExportButton() {
	if (document.getElementById('checkboxWorkflow').checked) {
		document.getElementById('checkboxWorkflow').disabled = true;
		exportModelAjaxCall();
	}
}

function goToExportWorkflow() {
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
                        'taskToComplete': "construction"
                    }),
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
}