var strategiesTable;

var jsonWorkflowBusiness;
var jsonData;
var idBusinessWorkflow;

$(document).ready(function() {
	checkSystemState();
	getStrategicPlans();
	$("#strategyDescription").fadeOut();
	$("#createWorkflowBusiness").fadeOut();
});

var myWindow;
function doRedirect() {
	// Genera il link alla pagina che si desidera raggiungere
	myWindow.close();
	location.href = get3242BackEnd() + "/activiti/activitiExplorerModeler/"
			+ idBusinessWorkflow;
}

function createWorkflowBusiness() {

	myWindow = window.open(get3242BackEnd() + "/activiti/activitiExplorerLogin/kermit/kermit");
	
	window.setTimeout("doRedirect()", 2500);
}

function getStrategies(strategicPlanId) {
	$("#strategyDescription").fadeOut();
	$("#createWorkflowBusiness").fadeOut();
	$.ajax({url : get3242BackEnd() + "/strategicPlan/getStrategyWithWorkflow?strategicPlanId=" + strategicPlanId}).then(
		function(data) {
			var jsonStrategies = JSON.parse(JSON.stringify(data));
			if (strategiesTable != null)
				strategiesTable.destroy();
			$('#listStrategies').empty();
			strategiesTable = $('#listStrategies').DataTable({
				data : jsonStrategies.strategies,
				columns : [ {
					data : 'name'
				} ],
				"autoWidth" : true
			});

			$('#listStrategies tbody').on('click','tr', function() {
				/* Mostra l'elemento selezionato. */
				var strategyId = strategiesTable.row(this).data()['id'];
				var strategyDescription = strategiesTable.row(this).data()['description'];
				$("#listStrategies .odd").css('background-color', "inherit");
				$("#listStrategies .even").css('background-color', "inherit");
				$(this).css('background-color', "#D6D5C3");
				$.ajax({url: get3242BackEnd() + "/strategicPlan/getStrategyWorkflowData/?strategicPlanId=" + strategicPlanId + "&strategyId=" + strategyId}).then(function(data) {
					var strategyWorkflow = JSON.parse(JSON.stringify(data));
					idBusinessWorkflow = strategyWorkflow.workflow.businessWorkflowModelId;
					$("#strategyDescription").fadeIn();
					$("#createWorkflowBusiness").fadeIn();
					$('#strategyDescription').text(strategyDescription);
				});
			});
		});
}

function getStrategicPlans() {
	$.ajax({ url : get3242BackEnd() + "/strategicPlan/getStrategicPlans"}).then(function(data) { 
		jsonData = JSON.parse(JSON.stringify(data));
		console.log(jsonData.strategicPlans); 
		var strategicPlanTable = $('#listStrategicPlans').DataTable(
		{ 
			data : jsonData.strategicPlans,
			columns : [ { data : 'name' } ], 
			"autoWidth" : true
		});
	 
		$('#listStrategicPlans tbody').on('click', 'tr', function() {
			$("#listStrategicPlans .odd").css('background-color', "inherit");
			$("#listStrategicPlans .even").css('background-color', "inherit");
			$(this).css('background-color', "#D6D5C3");
			getStrategies(strategicPlanTable.row(this).data()['id']);
		}); 
	});
}
