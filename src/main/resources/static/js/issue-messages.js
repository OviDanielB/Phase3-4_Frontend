$(document).ready(function() {
	checkSystemState();
	populateIssueMessagesView();
});

function populateIssueMessagesView() {
	$.ajax({
		type : "GET",
		url : getPhase3URL() + "/bus/issueMessages",
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(response, textStatus, xhr) {
			var tbody = $('#table_body');

			$.each(response, function(i, item) {
				// create an <tr> element, append it to the <tbody> and cache it
				// as a variable:
				var tr = $('<tr/>').appendTo(tbody);
				tr.append('<td>' + item.businessWorkflowName + '</td>');
				tr.append('<td>' + item.businessWorkflowInstanceId + '</td>');
				tr.append('<td>' + item.messageType + '</td>');
				tr.append('<td>' + item.messageContent + '</td>');
				tr.append('<td>' + item.issueMessageResources + '</td>');
				tr.append('<td><button class="btn btn-lg" ' +
					'onclick="javascript:confirmIssue(' + item.businessWorkflowInstanceId + ',' + item.messageType +
					')">Confirm Issue</button></td>');
				tr.append(this.innerHTML);
			});

		},
		error : function(err, xhr) {
			console.log(err.responseText);

		}
	});
}

function confirmIssue(businessWorkflowInstanceId, messageType) {
	var issueMessage = {
		"businessWorkflowProcessInstanceId" : businessWorkflowInstanceId,
		"messageType" : messageType
	};
	$.ajax({
		url: getPhase3URL() + "/BusinessIssueMessage",
		type: "POST",
		data: data,
		success : function (response) {
			console.log("Issue confermata");
        },
		error : function (response) {
			console.log(response);
        }

	})
}