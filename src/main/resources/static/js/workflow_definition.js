var strategiesTable;

var jsonData;
var idBusinessWorkflow;

var status = {
    MODIFIED : 0,
    NOTMODIFIED : 1,
    NEW : 2
};

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
    location.href = getPhase3URL() + "/activiti/activitiExplorerModeler/"
        + idBusinessWorkflow;
	// myWindow.close();
    // window.location.href = getFrontbasePath() + '/models/deploy.html?modelId=' + idBusinessWorkflow
	// 	+ "&name=" + getURLParameter('name');
    // location.href = getPhase3URL() + "/activiti/activitiExplorerModeler/"
	// 		+ idBusinessWorkflow;
}

// populate business workflow
function createWorkflowBusiness() {

    myWindow = window.open(getPhase3URL() + "/activiti/activitiExplorerLogin/kermit/kermit");

    window.setTimeout("doRedirect()", 2500);
}

function getStrategies(strategicPlanId) {
    $("#strategyDescription").fadeOut();
    $("#createWorkflowBusiness").fadeOut();
    $.ajax({url: getPhase3URL() + "/strategicPlan/getStrategyWithWorkflow?strategicPlanId=" + strategicPlanId}).then(
        function (data) {
            var jsonStrategies = JSON.parse(JSON.stringify(data));
            if (strategiesTable != null)
                strategiesTable.destroy();
            $('#listStrategies').empty();
            strategiesTable = $('#listStrategies').DataTable({
                data: jsonStrategies.strategies,
                columns: [{
                    data: 'name'
                }, {
                    data: 'status'
                }],

                "autoWidth": true
            });

            $('#listStrategies tbody').on('click', 'tr', function () {
                /* Mostra l'elemento selezionato. */
                var strategyId = strategiesTable.row(this).data()['id'];
                var strategyDescription = strategiesTable.row(this).data()['description'];
                $("#listStrategies .odd").css('background-color', "inherit");
                $("#listStrategies .even").css('background-color', "inherit");
                $(this).css('background-color', "#D6D5C3");
                $.ajax({url: getPhase3URL() + "/strategicPlan/getStrategyWorkflowData/?strategicPlanId=" + strategicPlanId + "&strategyId=" + strategyId})
                    .then(function (data) {
                        var strategyWorkflow = JSON.parse(JSON.stringify(data));
                        idBusinessWorkflow = strategyWorkflow.workflow.businessWorkflowModelId;
                        $("#strategyDescription").fadeIn();
                        $('#strategyDescription').text(strategyDescription);

                        if (strategyWorkflow.strategy.status == 2) {
                            $("#button_create").text("Create Business workflow");
                            $("#button_create").on("click", function () {
                                createWorkflowBusiness();
                            });
                        } else if (strategyWorkflow.strategy.status == 0) {
                            $("#button_create").text("Modify Business workflow");
                            $("#button_create").on("click", function () {
                                createWorkflowBusiness();
                            });
                        } else if (strategyWorkflow.strategy.status == 1) {
                            $("#button_create").text("Visualize Business workflow");
                        }

                        $("#createWorkflowBusiness").fadeIn();
                    });
            });
        });
}

function getStrategicPlans() {
	$.ajax({ url : getPhase3URL() + "/strategicPlan/getStrategicPlans"}).then(function(data) {
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

// function deployWorkflow() {
//     var id = getURLParameter('id');
//
//     if (id == null) {
//         document.getElementById('errorPanelDiv').innerHTML = "The modelId is null!";
//         document.getElementById("errorDiv").style.display = "block";
//     } else {
//         modelId = idBusinessWorkflow;
//     	location.href = getPhase3URL() + '/models/deploy.html?=modelId' + modelId;
//     }
// }
