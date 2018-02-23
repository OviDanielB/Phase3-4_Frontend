var jsonData;
var table;
var tableStrategiesOfStrategicPlan;
var strategicPlan;
var strategies;
var strategiesStrategicPlan;
var id = urlParam('id');

$(document).ready(function () {
    checkSystemState();
    //alert(urlParam('id'));
    id = urlParam('id');

    $.ajax({
        url: getPhase3URL() + "/strategicPlan/getStrategicPlan?id=" + id

    }).then(function (sp) {
        strategicPlan = JSON.parse(JSON.stringify(sp));

        $.ajax({

            url: getPhase3URL() + "/strategicPlan/getStrategiesOfStrategicPlan?id=" + id


        }).then(function (str) {


            strategiesStrategicPlan = JSON.parse(JSON.stringify(str));
            //alert(JSON.stringify(data));

            tableStrategiesOfStrategicPlan = $('#strategiesOfStrategicPlanTable').DataTable({
                data: strategiesStrategicPlan.strategies,
                columns: [
                    {data: 'name'},
                    {data: 'description'},
                    {data: 'version'},
                    {data: 'release'},
                    {data: 'organizationalunit'}

                ],
                "autoWidth": true

            });

        });


    });


    $.ajax({

        url: getPhase3URL() + "/strategicPlan/getStrategiesWithOrganizationalUnitOfStrategicPlan?id=" + id

    }).then(function (data) {

        jsonData = JSON.parse(JSON.stringify(data));
        //alert(JSON.stringify(data));


        strategies = JSON.parse(JSON.stringify(data));
        var strategiesOfOrganizationalUnit = new Array();
        for (var stm in strategies.strategyWorkflowRelationList) {
            //if (strategy.strategyWorkflowRelationList[stm].strategy == null)
            strategiesOfOrganizationalUnit.push(strategies.strategyWorkflowRelationList[stm].strategy);
        }

        console.log(strategiesOfOrganizationalUnit);
        table = $('#strategiesTable').DataTable({
            //data: jsonData.strategies,
            data: strategiesOfOrganizationalUnit,
            columns: [
                {data: 'name'},
                {data: 'description'},
                {data: 'version'},
                {data: 'release'},
                {data: 'organizationalunit'}

            ],
            "autoWidth": true

        });

        $('#strategiesTable tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });

    });

});


function urlParam(id) {
    var results = new RegExp('[\?&]' + id + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

function goBack() {

    url = getFrontbasePath() + "/modify-strategic-plan.html?id=" + id;
    window.location.href = url

}

function updateStrategies() {

    if (table.rows('.selected').data().length != 0) {

        var strategies = strategicPlan.strategyToWorkflowId;
        var swRelation;

        for (var j = 0; j < table.rows('.selected').data().length; j++) {
            swRelation = {
                _id: null,
                strategy: table.rows('.selected').data()[j],
                workflow: null
            }
            strategies.push(swRelation);
        }


        strategicPlan.strategyWorkflowIds = strategies;

        alert(JSON.stringify(strategicPlan.strategyWorkflowIds));

        var urlto = getPhase3URL() + "/strategicPlan/updateStrategiesOfStrategicPlan";

        $.ajax({
            url: urlto,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(strategicPlan)
        });

        //alert(JSON.stringify(strategicPlan));
        alert("Strategic Plan modificato correttamente");
        location.reload();

    }
    else {
        alert("Non hai selezionato nessuna strategia! Seleziona delle strategie per modificare il piano strategico");
    }

}
