$(document).ready(function() {
	checkSystemState();
	var runtimeTaskId = getURLParameter("runtimeTaskId");
	taskId = getURLParameter("taskId");
	var validationId = getURLParameter("validationId");
	
	setValidationDetails();
	
	$('#buttonExecuteValidation').on("click", function() {
		executeValidation(validationId);
	});
	
	$('#buttonSuccess').on("click", function() {
/*        $.ajax({
            'url' : getPhase4URL() + "validation/completeValidation?taskId="
            + taskId + "&validationOpId=" + getURLParameter("validationId"),
            'type' : 'get',
            'contentType' : "application/json; charset=utf-8",
            'dataType' : "json",

            success : function(response) {
                //window.location.href = getUrlFrontEnd();
				/!* go to remaining validation op list *!/
                window.location.href = getUrlFrontEnd() +"/execute-validation.html?runtimeTaskId=" +
                    runtimeTaskId + "&taskId="+ taskId;
            },
            error : function(response) {
                alert(response.errorCode + " " + response.message);
            }
        });*/


	});
	
	$('#buttonRepeateMeasure').on("click", function() {
		if($('#insertError').val() == "") {
			alert("insert an error message");
		} else {
			repeateMeasure(runtimeTaskId, validationId);
		}
	});
	
	$('#buttonControlMetric').on("click", function() {
		if($('#insertError').val() == "") {
			alert("insert an error message");
		} else {
			repeateMeasure(runtimeTaskId, validationId);
		}
	});
	
	$('#buttonIgnoreValidation').on("click", function() {
		ignoreValidation(validationId);
	});	
});

/*
 * La funzione ignoreValidation richiama il servizio offerto dalla webapp di 
 * backend, che consente di ignorare una validazione. Se una validazione è 
 * fallita ma il validator si accorge che si può trattare soltanto di un dato
 * anomalo, può decidere di ignorare il risultato negativo della validazione.
 */
function ignoreValidation(validationId){
	$.ajax({
		'url' :getPhase4URL() + "/validation/ignoreValidation?id="
				+ validationId,
		'type' : 'get',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		
		success : function(response) {
			window.location.href = getUrlFrontEnd() +"/execute-validation.html?runtimeTaskId=" +
			runtimeTaskId + "&taskId="+ taskId;
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione setValidationDetails richiama il servizio offerto dalla webapp di
 * back end per ottenere i dettagli di una operazione di validazione e mostra 
 * a schermo i dettagli più rilevanti.
 */
function setValidationDetails() {
	$.ajax({
		'url' : getPhase4URL() + "/validation/validationOp?id="
				+ getURLParameter("validationId"),
		'type' : 'get',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		
		success : function(response) {
			var validation = JSON.parse(JSON.stringify(response));

			$("#page-title-name").append(validation.name);

			setDescription(validation.description);

		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione executeValidation richiama il servizio offerto dalla webapp
 * di back end per eseguire l'operazione di validazione associata ad un 
 * determinato validationId.
 */
function executeValidation(validationId) {
	$.ajax({
		'url' :getPhase4URL() + "/validation/validateData?id="
				+ getURLParameter("validationId"),
		'type' : 'get',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		
		success : function(response) {
			var response = JSON.parse(JSON.stringify(response));

			if(response.hasOwnProperty('countermeasures')){
				//validazione fallita
				showElementsValidationFailed(response);
			} else {
				//validazione effettuata con successo
				 $('#groupButtonSuccess').show();
			}
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione showElementsValidationFailed mostra i corretti elementi html che
 * servono per poter effettuare delle contromisure a seguito del fallimento di 
 * una validazione.
 */
function showElementsValidationFailed(response) {
	$('#groupStringError').show();  
	$('#stringError').text(response.message);

	var countermeasures = response.countermeasures;
	if(countermeasures != null) {
		var i;
		for (i = 0; i < countermeasures.length; i++) {
			showCountermeasure(countermeasures[i]);
		}
	}
}

/*
 * La funzione showCountermeasure mostra il bottone html relativo alla 
 * contromisura passata come parametro alla funzione.
 */
function showCountermeasure(countermeasure) {
	switch(countermeasure) {
	case "REPEATE_MEASURE":
		$('#groupRepeateMeasure').show();
		$('#groupInsertError').show();
		break;
	case "CONTROL_METRIC":
		$('#groupControlMetric').show();
		$('#groupInsertError').show();
		break;
	case "EXCLUDE_DATA":
		$('#groupIgnoreValidation').show();
		break;
	default:
		alert("Error: the countermeasure has a value not defined.");
		break;	
	}		
}

/*
 * La funzione repeateMeasure richiama il servizio offerto dalla webapp di back end
 * per poter comunicare al data collector che si deve riprendere la misura.
 */
function repeateMeasure(runtimeTaskId, validationId) {
	var errorMessage = $('#insertError').val();

	$.ajax({
		'url' : getPhase4URL() + "/validation/repeateMeasure?idRuntimeTask="
				+ runtimeTaskId +"&idValidationOp="+ validationId + "&errorMessage=" + errorMessage +"&taskId=" +taskId,
		'type' : 'get',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		
		success : function(response) {
			var response = JSON.parse(JSON.stringify(response));
			//Redirigi alla home page del validator
			window.location.href = getUrlFrontEnd();
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione setDescription inserisce nel relativo oggetto html la descrizione
 * dell'operazione di validazione che si deve effettuare.
 */
function setDescription(description) {
	$('#validationDescription').text(description);
}