$(function() {
	if (getCookie("role").indexOf("Strategic Planner") > -1) {
		$("li.strategic-plans-button").show();
	} else
		$("li.strategic-plans-button").hide();

	if (getCookie("role").indexOf("GQM Expert") > -1) {
		$("li.measurement-plan-workflows-button").show();
		$("li.issue-messages-button").show();
		$("li.end-workflow-button").show();
	} else {
		$("li.measurement-plan-workflows-button").hide();
		$("li.issue-messages-button").hide();
		$("li.end-workflow-button").hide();
	}
	var tasks = function() {

		$("#tasks,#tasks_progreess,#tasks_completed")
				.sortable(
						{
							items : "> .task-item",
							connectWith : "#tasks_progreess,#tasks_completed",
							handle : ".task-text",
							receive : function(event, ui) {

								// id task is always in third position of the
								// class list elements
								var id_task = ui.item.context.classList[2];

								if (this.id == "tasks_completed") {

									ui.item
											.addClass("task-complete")
											.find(".task-footer > .pull-right")
											.replaceWith(
													'<div class="pull-right"><a href="javascript:completeTask('
															+ id_task
															+ ')"><span class="fa fa-check">Complete</span></a></div>');

								}
								if (this.id == "tasks_progreess") {
									if (ui.item.context.childNodes[1].childNodes.length == 1) {

										var data = {
											'assignee' : assignee
										};

										$
												.ajax({
													url : getUrlBackEnd()
															+ 'tasks/'
															+ id_task
															+ '/claim',
													type : 'post',
													contentType : "application/json; charset=utf-8",
													data : JSON.stringify(data),
													success : function(response) {

														ui.item
																.find(
																		".task-footer")
																.append(
																		'<div class="pull-right"><a href="'
																				+ getUrlFrontEnd()
																				+ getPageTaskExecution()
																				+ '?taskId='
																				+ id_task
																				+ '"><span class="fa fa-tasks">Execute</span></a></div>');

													},
													error : function(err) {
														var error = $
																.parseJSON(err.responseText);
														alert(error.errorCode
																+ " "
																+ error.message);
													}
												});
									}

								}
								page_content_onresize();
							}
						}).disableSelection();

		/*
		 * $("#tasks,#tasks_progreess").sortable({ items: "> .task-item",
		 * connectWith: "#tasks_progreess", handle: ".task-text", receive:
		 * function(event, ui) { console.log("in sortable");
		 * document.getElementById("completeButton").style.display = "block";
		 * 
		 * if(this.id == "tasks_progreess"){ console.log("task progess") }
		 * 
		 * page_content_onresize(); } }).disableSelection();
		 * 
		 * 
		 * $("#tasks_progreess,#tasks_completed").sortable({ items: ">
		 * .task-item", connectWith: "#tasks_completed", handle: ".task-text",
		 * receive: function(event, ui) { if(this.id == "tasks_completed"){
		 * //ui.item.addClass("task-complete").find(".task-footer").remove();
		 * ui.item.addClass("task-complete"); console.log("task complete") }
		 * 
		 * page_content_onresize(); } }).disableSelection();
		 */

	}();

});

var assignee = getLoggedUsername();

function getLoggedUsername() {
	var tempAssignee = getCookie("username").replace(/\"/g, "");
	if (getURLParameter('username') && getURLParameter('username').length !== 0)
		tempAssignee = getURLParameter('username');
	if (!tempAssignee || tempAssignee.length === 0)
		redirectToLogin();
	return tempAssignee;
}

function getAssignee() {
	return assignee;
}

function redirectToLogin() {
	if (confirm("You are not logged in. Please, login first!"))
		document.location = getLoginPageUri();
}

function addField(id) {

	$("#box" + id).toggleClass("open");
}

// Complete a metaworkflow task
function completeTask(id) {

	// DEBUG
	var data = [];

	// send ajax call for complete task
	$.ajax({
		url : getUrlBackEnd() + 'tasks/' + id + '/complete',
		type : 'post',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(data),
		success : function(response) {
			// remove task from visualization
			if ($(".task-complete").hasClass(id)) {
				$(".task-complete." + id).remove();
			}
			location.reload();
		},
		error : function(err) {
			var error = $.parseJSON(err.responseText);
			alert(error.errorCode + " " + error.message);
		}
	});
}
