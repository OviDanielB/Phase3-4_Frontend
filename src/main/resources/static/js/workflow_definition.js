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
	// myWindow.close();
    myWindow.location.href = getFrontbasePath() + '/models/deploy.html?modelId=' + idBusinessWorkflow;
    location.href = getPhase3URL() + "/activiti/activitiExplorerModeler/"
			+ idBusinessWorkflow;
}

// populate business workflow
function createWorkflowBusiness() {

    goToPopulateBusinessWorkflow();

	myWindow = window.open(getPhase3URL() + "/activiti/activitiExplorerLogin/kermit/kermit");

	window.setTimeout("doRedirect()", 2500);
}

function goToPopulateBusinessWorkflow() {

    var keyName = getURLParameter('name');

    if (keyName == null) {
        document.getElementById('errorPanelDiv').innerHTML = "The workflowName is null!";
        document.getElementById("errorDiv").style.display = "block";
    } else {
        $.ajax({
            url: getPhase3URL() + "/activiti/instances?processDefinitionKey=" + keyName + "_workflow_handler",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (response, textStatus, xhr) {
                console.log(response);
                var res = JSON.parse(JSON.stringify(response));
                processDefinitionId = res.processDefinitionId;
                console.log(processDefinitionId);
                $.ajax({
                    type: "POST",
                    url: getPhase3URL() + "/workflows/complete-task",
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify({
                        'processDefinitionId' : processDefinitionId,
						// word contained only in the name of the task to complete
						'taskToComplete': "construction"
                    }),
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        document.getElementById('successPanelDiv').innerHTML = response.businessWorkflowProcessInstanceId;
                        document.getElementById("successDiv").style.display = "block";
                    },
                    error: function (err) {
                        var json_obj = $.parseJSON(err.responseText);
                        if (!json_obj.errorCode || !json_obj.message) {
                            document.getElementById('errorPanelDiv').innerHTML = "Expired timeout interval";
                        } else {
                            document.getElementById('errorPanelDiv').innerHTML = json_obj.errorCode
                                + json_obj.message;
                        }
                        document.getElementById("errorDiv").style.display = "block";
                    }
                });
            }
        });
    }
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
                        // idProcessDefinition = strategyWorkflow.workflow.businessWorkflowProcessDefinitionId;
                        $("#strategyDescription").fadeIn();
                        $('#strategyDescription').text(strategyDescription);

                        if (strategyWorkflow.strategy.status == 2) {
                            $("#button_create").text("Create Business workflow");
                            $("#button_create").on("click", function () {
                                createWorkflowBusiness(strategyId);
                            });
                        } else if (strategyWorkflow.strategy.status == 0) {
                            $("#button_create").text("Modify Business workflow");
                            $("#button_create").on("click", function () {
                                createWorkflowBusiness(strategyId);
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
