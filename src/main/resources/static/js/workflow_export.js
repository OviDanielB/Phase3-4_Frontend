$(document)
		.ready(
				function() {
					checkSystemState();
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
					url : getPhase4URL() + "bus/workflows",
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