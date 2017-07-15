/**
 * TODO: per il momento gestisce solo date del tipo "yyyy-MM-dd hh:mm"
 */
$(document).ready(function() {
	checkSystemState();
	var taskId = getURLParameter("taskId");
	fetchTaskInfo(taskId);
	fetchFormProperties(taskId);
	$('#executionForm').get(0).setAttribute('action', 'javascript:handleClick(' + taskId + ')');
});


function fetchTaskInfo(taskId) {
	$.ajax({ url : getPhase4URL() + "/activiti/userTaskByTaskId/" + taskId}).then(function(data) {
		jsonData = JSON.parse(JSON.stringify(data));
		$.ajax({ url : getPhase4URL() + "/tasks/" + taskId + "/description"}).then(function(data) {
			jsonDesc = JSON.parse(JSON.stringify(data));
			if (jsonData.description =="" || jsonData.description == null) {
				jsonData.description = jsonDesc.description;
			}
			getTaskInfo(jsonData);
		});
	});
}

function fetchFormProperties(taskId) {
	$.ajax({ url : getPhase4URL() + "/activiti/formDataTask/" + taskId}).then(function(data) {
		jsonData = JSON.parse(JSON.stringify(data));
		buildForm(jsonData);
	});
}

function saveTaskData(taskId, completeTask) {
	taskData = JSON.stringify(completeTask);
	console.log(taskData);
	$.ajax({
		url : getPhase4URL() + "/activiti/suspendTask/" + taskId,
		method: "POST",
		contentType: "application/json",
		data: taskData,
		success: function () {
			$("#mb-success").show();
		},
		error: function ()  {
			$("#mb-error").show();
		}
	});
}
/**
 * Gestisce l'invio del form, tenendo conto dei diversi tipi di campi.
 */
function handleClick(taskId) {
	//TODO: validazione dei tipi numerici
	//TODO: gestione della data
	var completeTask = [];
	$(".form-control").each(function() {
		/* Nel caso della select read only non devo considerarne il valore. */
		if ($(this).attr("id")) {
			var id = $(this).attr("id");
			var value = "";
			if ($(this).hasClass("date")) {
				console.log("date");
				value = $(this).val() + " " + $("#" + id + "_time").val();
			} else if ($(this).hasClass("time")) {
				/* Viene gestito con il datepicker. */
				return true;
			} else if ($(this).hasClass("boolean")){
				if ($(this).val() == "true") {
					value = true;
				} else if ($(this).val() == "false"){
					value = false;
				} else {
					/* La checkbox è writable */
					value = $(this).parent().hasClass("checked");
				}
			} else {
				value = $(this).val();
				console.log("il valore è " + value);
			}
			var elem = {
				"id" : id,
				"value" : value
			};
			completeTask.push(elem);
		}
	});
	saveTaskData(taskId, completeTask);
}

/**
 * Recupera le informazioni sul task.
 */
function getTaskInfo(task) {
	$("#taskId").text("#" + task.id);
	$("#taskName").text(task.name);
	$("#taskDescription").html(convert(task.description));
}

/**
 * Costruisce un form a partire dalle properties del task.
 */
function buildForm(properties) {
	var html;
	for (i = 0; i < properties.length; i++) {
		var item = properties[i];
		var defaultValue = "";
		if (item.readable == true && item.value != null) {
			defaultValue = item.value;
		}
		var readOnly = "";
		if (item.writable != true) {
			readOnly = "readonly";
		}
		
		var required = "";
		if (item.required) {
			required = "required";
		}
		
		var id = item.id;
		html = '<div class="form-group">';
		html += '<label class="col-md-3 col-xs-12 control-label">'+ item.name +'</label>';
		html += '<div class="col-md-6 col-xs-12">';
		
		switch(item.type) {
		case "string":
			var icon;
			html += '<div class="input-group">'
				+ '<span class="input-group-addon">'
				+ '<span class="fa fa-pencil"></span>'
				+ '</span>'
				+ '<input id="' + id + '" class="form-control" type="text" value="' + defaultValue + '" ' + readOnly + ' ' + required + '>'
				+ '</div>';
			break;
		case "long":
			html += '<div class="input-group">'
				+ '<span class="input-group-addon">'
				+ '<span>#</span>'
				+ '</span>'
				+ '<input id="' + id + '" class="form-control" type="number" value="' + defaultValue + '"' + readOnly + ' ' + required + '>'
				+ '</div>';
			break;
		case "boolean":
			if (item.writable != true) {
				if (defaultValue == true) {
					defaultValue = "true";
				} else {
					defaultValue = "false";
				}
				html += '<div class="input-group">'
					+ '<span class="input-group-addon">'
					+ '<span class="fa fa-check"></span>'
					+ '</span>'
					+ '<input id="' + id + '" class="form-control boolean" type="text" value="' + defaultValue + '" ' + readOnly + ' ' + required + '>'
					+ '</div>';
			} else {
				if (defaultValue == true) {
					defaultValue = "checked";
				}
				html += '<label class="check">'
					+ '<input id="' + id + '" class="form-control icheckbox boolean" type="checkbox"' + defaultValue + ' ' + required + '>'
					+ 'True'
					+ '</label>';
			}
			break;
		case "enum":
			if (item.writable != true) {
				var defaultName = "";
				for (j = 0; j < item.enumValues.length; j++) {
					enumVal = item.enumValues[j];
					var selected = "";
					if (enumVal.id == defaultValue) {
						defaultName = enumVal.name;
					}
				}
				html += '<div class="input-group">'
					+ '<span class="input-group-addon">'
					+ '<span class="fa fa-list"></span>'
					+ '</span>'
					+ '<input type="text" class="form-control" value="' + defaultName + '" ' + readOnly + ' ' + required + '>'
					+ '<input id="' + id + '" class="form-control" type="hidden" value="' + defaultValue + '"'
					+ '</div>';
			} else {
				html += '<select id="' + id + '" class="form-control select" ' + required + '>';
				for (j = 0; j < item.enumValues.length; j++) {
					enumVal = item.enumValues[j];
					var selected = "";
					if (enumVal.id == item.value) {
						selected = "selected";
					}
					html += '<option value="' + enumVal.id + '"' + selected + '>' + enumVal.name + '</option>';
				}
				html += '</select>';
			}
			break;
		case "date":
			var datePicker = "";
			var timePicker = "";
			if (item.writable) {
				datePicker = "datepicker";
				timePicker = "timepicker24";
			}
			var defaultDate = "";
			var defaultTime = "";
			if (defaultValue != "") {
				//TODO: viene parsato in questo modo perché in realtà il formato della data è fisso
				defaultDate = defaultValue.split(" ")[0];
				defaultTime = defaultValue.split(" ")[1];
			}
			html += '<div class="input-group">'
				+ '<span class="input-group-addon">'
				+ '<span class="fa fa-calendar"></span>'
				+ '</span>'
				+ '<input id="' + id + '" class="form-control date ' + datePicker + '" type="text" value="' + defaultDate + '" ' + readOnly + ' ' + required + '>'
				+ '</div>';
			//separatore
			html += '</div></div>'
				+ '<div class="form-group">'
				+ '<label class="col-md-3 col-xs-12 control-label"></label>'
				+ '<div class="col-md-6 col-xs-12">';
			html += '<div class="input-group">'
				+ '<span class="input-group-addon">'
				+ '<span class="fa fa-clock-o"></span>'
				+ '</span>'
				+ '<input id="' + id + '_time" class="form-control time ' + timePicker + '" type="text" value="' + defaultTime + '" ' + readOnly + ' ' + required + '>'
				+ '</div>';
			break;
		}
		html += '</div></div>';
		$("#dynamicForm").append(html);
	}
}
