var table;
var jsonData;
$(document).ready(function () {
    checkSystemState();
    var urlto = getPhase3URL() + "/strategy/getStrategiesFree";
    $.ajax({
        url: urlto
        //"http://rest-service.guides.spring.io/greeting"
    }).then(function (data) {
        jsonData = JSON.parse(JSON.stringify(data));
        console.log(jsonData.strategies);
        table = $('#myTable').DataTable({
            data: jsonData.strategies,
            columns: [
                {data: 'organizationalunit'},
                {data: 'name'},
                {data: 'description'},
                {data: 'version'},
                {data: 'release'},
                {data: 'status'}
            ]
            , "autoWidth": true


        });


        $('#myTable tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });

    });
});


function CreateStrategicPlan() {

    if (table.rows('.selected').data().length != 0) {

        if ($("#name").val() != "") {
            var selectedStrategies = new Array();

            var unitorg = table.rows('.selected').data()[0]['organizationalunit'];

            var unitorgocc = 0;
            for (var i = 0; i < table.rows('.selected').data().length; i++) {
                selectedStrategies.push(table.rows('.selected').data()[i]['id']);
                if (table.rows('.selected').data()[i]['organizationalunit'] == unitorg) {
                    unitorgocc++;
                }
            }

            if (unitorgocc == table.rows('.selected').data().length) {


                var date = new Date(); //per impostare in automatico il campo releaseDate


                var vers = parseFloat($("#vers").val());
                //se è un numero lo accetta, altrimenti mette il campo a null. Supporta i float per le subversion

                var strategicplan = {

                    strategyId: selectedStrategies,
                    name: $("#name").val(),
                    description: $("#descr").val(),
                    version: vers,
                    release: date
                }
                var urlto = getPhase3URL() + "/strategicPlan/createStrategicPlan";
                $.ajax({

                    url: urlto,

                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(strategicplan),
                    success : function () {
                        alert("Strategic Plan creato correttamente");
                        url = getFrontbasePath() + "/strategic-plans.html";
                        window.location.href = url
                    },
                    error: function (error) {
                        alert("Errore nella creazione del piano strategico" + error);
                    }
                })


            } else {
                alert("Non puoi selezionare strategie con unità organizzativa differenti!");

            }

        }
        else {
            alert("Non hai completato tutti i campi o alcuni sono errati!");
        }
    }
    else {
        alert("Non hai selezionato nessuna strategia! Seleziona delle strategie per creare uno Strategic Plan");
    }

}