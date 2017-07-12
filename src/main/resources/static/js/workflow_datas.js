$(document).ready(function() {
	checkSystemState();
	populateListWorkflowView();
});

function populateListWorkflowView() {
	$.ajax({
		type : "GET",
		url : getPhase3URL() + "/workflowdatas",
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(response, textStatus, xhr) {
			var workflowList = $('#workflowListId');

			$.each(response, function(i, item) {

				if(item.measureTasksList != null){
					var workflowItem = $('<li/>').appendTo(workflowList);
					workflowItem.append('<li>'
							+ '<a href="' + getMeasurementPlanPathNoEdit(
								item.businessWorkflowModelId, item.businessWorkflowName)
							+ '">' + item.businessWorkflowName + '</a></li>');
					workflowItem.append(this.innerHTML);
				}
			});

		},
		error : function(err, xhr) {
			console.log(err.responseText);

		}
	});
}
