var processDefinitionId;
var taskId
var name;

$(document).ready(function() {
	checkSystemState();
	
	processDefinitionId = getURLParameter("processDefinitionId");

	taskId = getURLParameter("taskId");
	/*Il nome viene passato come parametro. */
	name = getURLParameter("measureName");
	$("#page-title-name").append(name);

	getValidationOps(processDefinitionId, taskId, name);
	
	$('#buttonAdd').on("click", function() {
		window.location.href = getUrlFrontEnd()+"/validationop.html?processDefinitionId=" +
		processDefinitionId + "&measureName="+ name + "&taskId="+ taskId;
	});
	
	$('#buttonSave').on("click", function() {
		window.location.href = getUrlFrontEnd()+"/measure-task.html?processDefinitionId=" +
		processDefinitionId;
	});
	
});

/*
 * La funzione getValidationOps richiama il servizio rest offerto dalla webapp di 
 * backend, per poter recuperare la lista di operazioni di validazione associata
 * ad un determinato taskId.
 */
function getValidationOps(processDefinitionId, taskId, measureName) {
	var data = {
		'measureTaskId' : taskId,
		'phase' : "PHASE_3"
	};

	$.ajax({
		url : getPhase3URL() + "/validation/validationOpList",
		type : 'get',
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		data : data,
		success : function(response) {

			response = JSON.parse(JSON.stringify(response));

			$(function() {
				$.each(response,function(i, item) {
					var $actionsText = '<button class="btn btn-default btn-rounded btn-sm" onclick="window.location.href = \''
						+ getUrlFrontEnd()
						+ '/validationop.html?processDefinitionId='
						+ processDefinitionId
						+ '&taskId='
						+ taskId
						+ '&measureName='
						+ measureName
						+ '&validationId='
						+ item.id
						+ '\';" event.stopPropagation();">\
				<i class="fa fa-pencil"></i>\
				</button>\
				<button class="btn btn-danger btn-rounded btn-sm" onclick="deleteValidation(\''+item.id+'\');">\
					<i class="fa fa-times"></i>\
				</button>';
					
					var $tr = $(
							'<tr>')
							.append(
									$('<td>').text(
											item.name),
									$('<td>').text(
											item.description),
									$('<td>').text(
											item.type),
									$('<td>')
											.html(
													$actionsText));
					$tr.appendTo("#valOpTable");
				});
			});

		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione deleteValidation richiama il servizio rest offerto dalla webapp di 
 * backend, per poter eliminare una singola operazione di validazione associata
 * ad una determinata misura.
 */
function deleteValidation(validationId) {
	$.ajax({
		url : getPhase3URL() + "/validation/validationOp?id="
				+ validationId,
		type : 'delete',
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(response) {
			window.location.href = getUrlFrontEnd()+"/validationop-list.html?processDefinitionId=" +
			processDefinitionId + "&measureName="+ name + "&taskId="+ taskId;
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}
