$(document).ready(function() {
	checkSystemState();
	populateIssueMessagesView();
});

function populateIssueMessagesView() {
	$.ajax({
		type : "GET",
		url : getUrlBackEnd() + "bus/issueMessages",
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
				tr.append('<td>' + item.issueMessage + '</td>');
				tr.append('<td>' + item.issueMessageResources + '</td>');
				tr.append(this.innerHTML);
			});

		},
		error : function(err, xhr) {
			console.log(err.responseText);

		}
	});
}