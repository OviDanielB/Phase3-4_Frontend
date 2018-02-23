var list;
var jsonData;

$(document)
    .ready(
        function () {
            checkSystemState();
            var urlto = getPhase3URL() + "/strategicPlan/getStrategicPlans";
            $
                .ajax({
                    url: urlto
                    // "http://rest-service.guides.spring.io/greeting"
                })
                .then(
                    function (data) {
                        jsonData = JSON.parse(JSON
                            .stringify(data));
                        console.log(jsonData.strategicPlans);
                        var table = $('#myTable')
                            .DataTable(
                                {
                                    "fnRowCallback": function (nRow, Data,
                                                               iDisplayIndex) {
                                        var modified = 0;
                                        // alert(JSON.stringify(data.strategyWorkflowIds[0].strategy));
                                        for (strategyTw in data.strategyWorkflowIds) {
                                            if (data.strategyWorkflowIds[strategyTw].strategy.status != 0) {
                                                modified++;
                                            }


                                        }
                                        var $cell = $(
                                            'td:eq(4)',
                                            nRow);
                                        if (modified == 0) {
                                            $cell
                                                .text('Not modified');
                                        }
                                        else {
                                            $cell
                                                .text('New/ Modified');
                                        }

                                        return nRow;

                                    },
                                    data: jsonData.strategicPlans,
                                    columns: [
                                        {
                                            data: 'name'
                                        },
                                        {
                                            data: 'description'
                                        },
                                        {
                                            data: 'version'
                                        },
                                        {
                                            data: 'release'
                                        }, {data: 'release'}, {}],
                                    "autoWidth": true,
                                    columnDefs: [{
                                        targets: -1,
                                        data: null,
                                        defaultContent: "<button id='editsp' class='glyphicon glyphicon-pencil'/> <button id='deletesp' class='glyphicon glyphicon-remove'/><button id='addwftosp' class='glyphicon glyphicon-object-align-vertical'>Add Workflow </button>"
                                    }],

                                });

                        $('#myTable tbody')
                            .on(
                                'click',
                                'tr',
                                function () {

                                    str = JSON
                                        .stringify(table
                                            .row(
                                                this)
                                            .data());
                                    url = getFrontbasePath()
                                        + "/strategic-plan.html?id=";
                                    window.location.href = url
                                        + escape(table
                                            .row(
                                                this)
                                            .data()['id']);

                                });

                        $('#myTable tbody')
                            .on(
                                'click',
                                '#editsp',
                                function (e) {
                                    e.stopPropagation();
                                    var clickedstrategicPlan = table
                                        .row(
                                            $(
                                                this)
                                                .parents(
                                                    'tr'))
                                        .data();
                                    url = getFrontbasePath()
                                        + "/modify-strategic-plan.html?id=";
                                    window.location.href = url
                                        + clickedstrategicPlan['id'];

                                    // alert(
                                    // JSON.stringify(clickedstrategicPlan)
                                    // );
                                });

                        $('#myTable tbody')
                            .on(
                                'click',
                                '#deletesp',
                                function (e) {
                                    e.stopPropagation();
                                    var clickedstrategicPlan = table
                                        .row(
                                            $(
                                                this)
                                                .parents(
                                                    'tr'))
                                        .data();
                                    url = getPhase4URL()
                                        + "/strategicPlan/deleteStrategicPlan?id=";
                                    $
                                        .ajax({
                                            url: url
                                            + clickedstrategicPlan['id']
                                            // "http://rest-service.guides.spring.io/greeting"
                                        })
                                    location.reload();

                                });

                        $('#myTable tbody')
                            .on(
                                'click',
                                '#addwftosp',
                                function (e) {
                                    e.stopPropagation();
                                    var clickedstrategicPlan = table
                                        .row(
                                            $(
                                                this)
                                                .parents(
                                                    'tr'))
                                        .data();
                                    url = getFrontbasePath()
                                        + "/workflow-management.html?id=";
                                    window.location.href = url
                                        + clickedstrategicPlan['id'];

                                });

                    });
        });

function onRowClick(id) {

    alert("id " + id);

}
