$(document)
		.ready(
				function() {
					checkSystemState();
					//var name = getURLParameter('name');
					//$(".page-title-name").append(name);
					//document.getElementById('labelWorkflowTerminate').innerHTML = name;
					obtainWorkflowsList();
					
				});

function terminateWorkflowAjaxCall() {
	//var name = getURLParameter("name");
	var bWfProcInstanceId = document.getElementById('workflowsSelect').value;
	var bWfName = document.getElementById('workflowsSelect');

	$.ajax({
				type : "POST",
				url : getUrlBackEnd()+"BusinessEndingMessages",
				data : JSON.stringify({
					'businessWorkflowProcessInstanceId' : bWfProcInstanceId
				}),
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(response) {
					document.getElementById('successPanelDiv').innerHTML = "The workflow "+ bWfName.options[bWfName.selectedIndex].value +" was properly terminated!";
					document.getElementById("successDiv").style.display = "block";

				},
				error : function(err) {
					var json_obj = $.parseJSON(err.responseText);
						document.getElementById('errorPanelDiv').innerHTML = json_obj.errorCode  + " "+
						+ json_obj.message;
					document.getElementById("errorDiv").style.display = "block";

				}
			});
}

function TerminateButton() {
	if (document.getElementById('checkboxTerminateWf').checked) {
		document.getElementById('checkboxTerminateWf').disabled = true;
		terminateWorkflowAjaxCall();
	} 
	
}

function obtainWorkflowsList() {
	$.ajax({
		url : getUrlBackEnd() + '/workflowdatas/?ended=false',
		type : 'get',
		contentType : "application/json; charset=utf-8",
		success : function(workflowDataList) {//per ogni jsonObject (ogni JsonObject è un workflowData)
			$.each(workflowDataList, function(index, val){
				var opt = document.createElement("option");
				   opt.value= val.businessWorkflowProcessInstanceId;
				   opt.innerHTML = val.businessWorkflowName; 

				   var workflowsSelect=document.getElementById('workflowsSelect');
				   workflowsSelect.appendChild(opt);
			});
		},
		error : function(response) {
			document.getElementById('errorPanelDiv').innerHTML = "There was an error in retrieving list of workflows not terminated yet!";
			document.getElementById("errorDiv").style.display = "block";
		}
	});
	
}