$(document)
		.ready(
				function() {
					checkSystemState();
					var name = getURLParameter('name');
					$(".page-title-name").append(name);
					document.getElementById('labelProcessStart').innerHTML = name;
					var procDefId = getURLParameter("processDefinitionId");
					checkIfStarted(procDefId);
				});

function startProcessAjaxCall() {
	var procDefId = getURLParameter("processDefinitionId");

	if (procDefId == null) {
		document.getElementById('errorPanelDiv').innerHTML = "The processDefinitionId is null!";
		document.getElementById("errorDiv").style.display = "block";
	} else {
		$
				.ajax({
					type : "POST",
					url : getPhase3URL() + "/workflows/processinstances",
					data : JSON.stringify({
						'processDefinitionId' : procDefId
					}),
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					success : function(response) {
						console.log(response);
						document.getElementById('successPanelDiv').innerHTML = response.businessWorkflowProcessInstanceId;
						document.getElementById("successDiv").style.display = "block";

					},
					error : function(err) {
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
}
function StartButton() {
	if (document.getElementById('checkboxProcess').checked) {
		document.getElementById('checkboxProcess').disabled = true;
		startProcessAjaxCall();
	}
}

function checkIfStarted(procDefId) {
	if (procDefId == null) {
		document.getElementById('errorPanelDiv').innerHTML = "The processDefinitionId is null!";
		document.getElementById("errorDiv").style.display = "block";
	} else {

		$
				.ajax({
					type : "GET",
					url : getPhase3URL() + "/workflows/" + procDefId + "/process-instance",
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					success : function(response,textStatus, xhr) {
						if(xhr.status == 204){
						    //nothing to do
							//document.getElementById('successPanelDiv').innerHTML = "The process instance is not started yet! You can start it!";
							// document.getElementById("successDiv").style.display = "block";
						}
						else if(xhr.status == 200){
							document.getElementById('checkboxProcess').disabled = true;
							document.getElementById('errorPanelDiv').innerHTML = "The process instance  "+ response.businessWorkflowProcessInstanceId +" was already started!";
							document.getElementById("errorDiv").style.display = "block";
						}

					},
					error : function(err,xhr) {
						if(xhr.status == 204){
							document.getElementById('successPanelDiv').innerHTML = "The process instance is not started yet! You can start it!";
							document.getElementById("successDiv").style.display = "block";
							}

					}
				});
	}
	
}