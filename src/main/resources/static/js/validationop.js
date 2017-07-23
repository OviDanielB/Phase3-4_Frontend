$(document).ready(function() {
	var name;
	var processDefinitionId = getURLParameter("processDefinitionId");
	var measureId = getURLParameter("taskId");
	var measureName = getURLParameter("measureName");
	var validationId;
	
	checkSystemState();

	// goToPlanValidationOp();

    getMeasuresRef(processDefinitionId);

	console.log(processDefinitionId);

	if (window.location.search.indexOf('validationId=') > -1) {
		/* Caso modifica di validazione esistente */
		validationId = getURLParameter("validationId");
		getValidationDetails(validationId);
	} else {
		/* Caso nuova validazione */
		validationId = null;
		name = "New Validation";
		console.log("name");
		$("#page-title-name").append(name);
	}

	refreshPage();

	$('#buttonSubmit').on("click", function() {
		controlAndSaveValidation(processDefinitionId, measureName, measureId, validationId);
	});

	$("#selectCardinality").change(function() {
		updateSelectCardinality();
	});

	$("#cardinalityRef").change(function() {
		updateSelectCardinalityRef();
	});

	$("#valueType").change(function() {
		updateValueType();
	});

	$("#selectInputMeasure").change(function() {
		updateSelectInputMeasure();
	});

	if (!Modernizr.inputtypes.number) {
		$(document).on('keyup', '.numeric', function(event) {
			var v = this.value;
			if ($.isNumeric(v) === false) {
				this.value = this.value.slice(0, -1);
			}
		});
	}
});

/*
 * La funzione refreshPage permette di mostrare i giusti elementi sullo schermo.
 */
function refreshPage() {
	updateSelectCardinality();
	updateSelectCardinalityRef();
	updateSelectInputMeasure();
	updateValueType();
}

/*
 * La funzione updateValidation consente di aggiornare con i dati nuovi 
 * l'operazione di validazione associata all'id validationId.
 */
function updateValidation(processDefinitionId, measureName, measureId, validationId) {
	
	var validationOp = {
			"name" : $('#nameValidationOp').val(),
			"type" : $('#selectValidationType').val(),
			"description" : $('#description').val(),
			"cardinality" : getCardinality(),
			"compType" : $('#selectComparison').val(),
			"measureTaskId" : measureId,
			"refMeasureTaskId" : getRefMeasureTaskId(),
			"referenceParams" : getReferenceParams(),
			"countermeasures" : getSelectedCountermeasures(),
			"thisOp" : getThisOp(),
			"refOp" : getRefOp(),
			"userDefined" : getUserDefined()
		};
	
	console.log(validationOp);
	$.ajax({
		'url' : getPhase3URL() +"/validation/validationOp?id=" + validationId,
		'type' : 'PUT',
		'contentType' : "application/json; charset=utf-8",
		'dataType' : "json",
		'data' : JSON.stringify(validationOp), 
		success : function(response) {
			window.location.href = getUrlFrontEnd() + "/validationop-list.html?processDefinitionId=" +
			processDefinitionId + "&measureName="+ measureName + "&taskId="+ measureId;
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione getMeasureRef effettua la chiamata al servizio offerto dalla webapp
 * di backend, per poter recuperare la lista di measureTask associati ad un 
 * determinato workflow. Il workflow è identificato dal processDefinitionId.
 */
function getMeasuresRef(processDefinitionId) {
	var data = {
		'businessWorkflowProcessDefinitionId' : processDefinitionId
	};

	$.ajax({
		url : getPhase3URL() + "/validation/measureTasks",
		type : 'get',
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		data : data,
		success : function(response) {
			jsonData= JSON.parse(JSON.stringify(response));
	    	var measures = jsonData.metricTask;
			
			measures.forEach(function(measure, index) {
				
				 $('#selectMeasureRef')
		         .append($("<option></option>")
		         .attr("value",measure.idTask)
		         .text(measure.nameTask));
				 
			});
			
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione createValidation permette di richiamare il servizio rest che 
 * consente di memorizzare una nuova validazione associata alla misura 
 * measureId.
 * */
function createValidation(processDefinitionId, measureName, measureId) {

	var validationOp = {
		"name" : $('#nameValidationOp').val(),
		"type" : $('#selectValidationType').val(),
		"description" : $('#description').val(),
		"cardinality" : getCardinality(),
		"compType" : $('#selectComparison').val(),
		"measureTaskId" : measureId,
		"refMeasureTaskId" : getRefMeasureTaskId(),
		"referenceParams" : getReferenceParams(),
		"countermeasures" : getSelectedCountermeasures(),
		"thisOp" : getThisOp(),
		"refOp" : getRefOp(),
		"userDefined" : getUserDefined()
	};
			
	$.ajax({
		url : getPhase3URL() + "/validation/validationOp",
		type : 'POST',
		contentType : 'application/json; charset=utf-8',
		dataType : 'json',
		data : JSON.stringify(validationOp),
		success : function(response) {
			window.location.href = getUrlFrontEnd() + "/validationop-list.html?processDefinitionId=" +
			processDefinitionId + "&measureName="+ measureName + "&taskId="+ measureId;
		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione getValidationDetails richiama il servizio offerto dalla webapp di 
 * backend per poter riprendere i dettagli della validazione identificata dal
 * parametro validationId.
 */
function getValidationDetails(validationId) {
	$.ajax({
		url : getPhase3URL() + "/validation/validationOp?id=" + validationId,
		type : 'get',
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(response) {
			var validationOp = JSON.parse(JSON.stringify(response));

			$("#page-title-name").append(validationOp.name);

			setName(validationOp.name);
			setValidationType(validationOp.type);
			setDescription(validationOp.description);
			setCardinality(validationOp.cardinality);

			if ($('#selectCardinality option:selected').val() == "many") {
				setThisOp(validationOp.thisOp);
			}

			setCompType(validationOp.compType);
			setUserDefined(validationOp.userDefined);
			setSelectedCountermeasures(validationOp.countermeasures);

			if (validationOp.userDefined == true) {
				setReferenceParams(validationOp.referenceParams);
			} else {
				setIdRefMeasureTask(validationOp.idRefMeasureTask);
				setRefOp(validationOp.refOp);
			}

		},
		error : function(response) {
			alert(response.errorCode + " " + response.message);
		}
	});
}

/*
 * La funzione getSelectedCountermeasures permette di memorizzare in un array
 * l'insieme delle contromisure selezionate in fase di pianificazione 
 * dall'utente.
 */
function getSelectedCountermeasures() {
	var countermeasures = [];
	var i = 0;
	if ($('#checkRepeatMeasure').prop('checked')) {
		countermeasures[i] = $('#checkRepeatMeasure').val();
		console.log(i+"repeat measure");
		i++;
	}
	if ($('#checkControlMeasure').prop('checked')) {
		countermeasures[i] = $('#checkControlMeasure').val();
		console.log(i+"control measure");
		i++;
	}
	if ($('#checkExcludeData').prop('checked')) {
		countermeasures[i] = $('#checkExcludeData').val();
		i++;
	}
	
	return countermeasures;
}

/*
 * La funzione getCardinality permette di ottenere la cardinalità associata al
 * dato che si sta cercando di validare.
 */
function getCardinality() {
	if($('#selectCardinality option:selected').val() == "one") {
		if ($('#operationRef').offsetParent === null) {
			//caso in cui è l'utente ad inserire il valore del dato2
			return "COMPARE_ONE_TO_ONE";
		} else {
			if($('#selectCardinalityRef option:selected').val() == "one") {
				return "COMPARE_ONE_TO_ONE";
			} else {
				return "COMPARE_ONE_TO_MANY";
			}
		}
	} else {
		if ($('#operationRef').offsetParent === null) {
			//caso in cui è l'utente ad inserire il valore del dato2
			return "COMPARE_MANY_TO_ONE";
		} else {
			if($('#selectCardinalityRef option:selected').val() == "one") {
				return "COMPARE_MANY_TO_ONE";
			} else {
				return "COMPARE_MANY_TO_MANY";
			}
		}
	}
}

/*
 * La funzione getUserDefined ritorna true se la misura di confronto del dato da 
 * validare è inserita dall'utente, false se invece è presa da una misura 
 * contenuta nel database.
 */
function getUserDefined() {
	if ($('#selectInputMeasure').val() == "user") {
		return true;
	} else {
		return false;
	}
}

/*
 * La funzione getRefOp restituisce l'operazione da effettuare sui dati raccolti
 * per fare il confronto con il dato da validare.
 */
function getRefOp() {
	if ($('#operationRef').offsetParent === null) {
		// se non è visibile il form relativo all'operazione di riferimento
		return null;
	} else if ($('#selectCardinalityRef').val() == "many") {
		return $('#selectOperationRef option:selected').val();	
	}else {
		return null;
	}
}

/*
 * La funzione getThisOp restituisce l'operazione da effettuare sui dati raccolti
 * relativi alla misura da validare.
 */
function getThisOp() {
	if ($('#selectCardinality').val() == "many") {
		return $('#selectOperation').val();
	} else {
		return null;
	}
}

/*
 * La funzione getReferenceParams restituisce (se presenti) tutti i valori inseriti dall'utente
 * per effettuare il confronto.
 */
function getReferenceParams() {
	if ($('#selectInputMeasure').val() == "user") {
		// se è visibile
		var refParams = [];

		if ($('#valueType option:selected').val() == "single") {
			// caso singleValue
			refParams[0] = $('#singleValue').val();
		} else {
			// caso intervalValue
			refParams[0] = $('#firstValue').val();
			refParams[1] = $('#secondValue').val();
		}
		return refParams;
	} else {
		// se la misura non è inserita dall'utente
		return null;
	}
}

/*
 * La funzione getRefMeasureTaskId ritorna il taskId della misura con cui 
 * effettuare il confronto.
 */
function getRefMeasureTaskId() {
	if ($('#selectInputMeasure').val() == "measure") {
		if($('#selectMeasureRef option:selected').val() == "noMeasure") {
			return null;
		}else {
			return $('#selectMeasureRef option:selected').val();
		}
	} else {
		// se non è visibile
		return null;
	}
}

/*
 * La funzione setIdRefMeasureTask setta come selected la misura che è stata 
 * passata come parametro alla funzione.
 */
function setIdRefMeasureTask(idRefMeasureTask) {
	$('#selectMeasureRef').val(idRefMeasureTask).change();
}

/*
 * La funzione setRefOp imposta la select di scelta dell'operazione di riferimento
 * al valore passato come parametro.
 */
function setRefOp(refOp) {
	$('#operationRef').val(refOp).change();
}

/*
 * La funzione setSelectedCountermeasures permette di impostare come selezionate
 * le contromisure che il validator aveva già scelto per quella determinata 
 * operazione di validazione.
 */
function setSelectedCountermeasures(countermeasures) {
	if(countermeasures != null) {
		var i;
		for (i = 0; i < countermeasures.length; i++) {
			$(":checkbox[value=" + countermeasures[i] +"]").prop("checked",
					"true");
		}
	}
}

/*
 * La funzione setReferenceParams permette di settare i valori che l'utente ha 
 * definito.
 */
function setReferenceParams(referenceParams) {
	if (referenceParams.length > 1) {
		// caso in cui c'è un intervallo di valori
		$('#valueType').val("interval").change();
		$('#firstValue').val(referenceParams[0]).change();
		$('#secondValue').val(referenceParams[1]).change();
	} else {
		$('#valueType').val("single").change();
		$('#singleValue').val(referenceParams[0]).change();
	}
}

/*
 * La funzione setUserDefined consente di settare il corretto valore del tipo di 
 * misura con cui effettuare il confronto.
 */
function setUserDefined(userDefined) {
	if (userDefined == true) {
		$('#selectInputMeasure').val("user").change();
	} else {
		$('#selectInputMeasure').val("measure").change();
	}
}

/*
 * La funzione setCompType consente di settare la corretta operazione di 
 * comparazione dei dati.
 */
function setCompType(compType) {
	$('#selectComparison').val(compType).change();
}

/*
 * La funzione setThisOp consente di settare la corretta operazione nel relativo
 * form di selezione dell'operazione da effettuare.
 */
function setThisOp(thisOp) {
	$('#selectOperation').val(thisOp).change();
}

/*
 * La funzione setName consente di settare il nome della validazione 
 * dentro il relativo form.
 */
function setName(name) {
	$('#nameValidationOp').val(name).change();
}

/*
 * La funzione setCardinality permette di settare i giusti valori nei form in base
 * alla cardinalità.
 */
function setCardinality(cardinality) {
	switch(cardinality) {
	case "COMPARE_ONE_TO_ONE":
		$('#selectCardinality').val("one").change();
		$('#selectCardinalityRef').val("one").change();
		break;
	case "COMPARE_ONE_TO_MANY":
		$('#selectCardinality').val("one").change();
		$('#selectCardinalityRef').val("many").change();
		break;
	case "COMPARE_MANY_TO_ONE":
		$('#selectCardinality').val("many").change();
		$('#selectCardinalityRef').val("one").change();
		break;
	case "COMPARE_MANY_TO_MANY":
		$('#selectCardinality').val("many").change();
		$('#selectCardinalityRef').val("many").change();
		break;
	default: 
		alert("ERROR: The value of cardinality from the back end is wrong");
		break;
	}
}

/*
 * La funzione setDescription consente di settare il messaggio di descrizione 
 * dentro il relativo form.
 */
function setDescription(description) {
	$('#description').val(description).change();
}

/*
 * La funzione setValidationType consente di mostrare il corretto tipo di 
 * validazione nel menù di selezione.
 */
function setValidationType(type) {
	$("#selectValidationType").val(type).change();
}

/*
 * La funzione updateSelectCardinality consente di mostrare i giusti form in base 
 * alla cardinalità della misura da validare.
 */
function updateSelectCardinality() {
	if ($('#selectCardinality option:selected').val() == "many") {
		$('#operation').show();
	} else {
		$('#operation').hide();
	}
}

/*
 * Il metodo controlAndSaveValidation permette di controllare e salvare una 
 * nuova validazione.
 */
function controlAndSaveValidation(processDefinitionId, measureName, measureId, validationId) {
 	if (isFormReady() == true) {
 		if(validationId == null) {
 			createValidation(processDefinitionId, measureName, measureId);
 		} else {
 			updateValidation(processDefinitionId, measureName, measureId, validationId);
  		}
 	} 
 }
 
 /*
  * Il metodo isFormReady controlla che i dati inseriti e selezionati nel form
  * sono corretti.
  */
 function isFormReady() {
 	if ($('#nameValidatioOp').val() == "" || $('#description').val() == "") {
 		return false;
 	} else if ($('#selectInputMeasure option:selected').val() == "user") {
 		if ($('#valueType option:selected').val() == "single") {
 			// caso singleValue
 			if ($('#singleValue').val() == "") {
 				return false;
 			}
 		} else {
 			if ($('#firstValue').val() == "" || $('#secondValue').val() == "") {
 				return false;
 			}
 		}
 	} else {
 		if ($('#selectMeasureRef option:selected').val() == "noMeasure") {
 			return false;
 		}
 	}
 	
 	if(isEmptyCheck()) {
 		return false;
 	}
 	
 	if(!checkInterval()) {
 		return false;
 	}
 	
 	if ($('#selectInputMeasure').val() == "user") {
 		if($('#valueType').val() == "interval") {
 			if(!checkCorrectnessInterval()) {
 				return false;
 			}
 		}		
 	}
 	
 	return true;
 }
 
 /*
  * Il metodo checkInterval controlla che l'intervallo sia inserito se c'è un
  * tipo di comparazione che richiede un intervallo.
  */
 function checkInterval() {
 	if($('#selectComparison').val() == "LESS_THAN" ||
 			$('#selectComparison').val() == "GREATER_THAN" || 
 			$('#selectComparison').val() == "EQUAL") {
 		if($('#selectInputMeasure').val() == "user" && 
 				$('#valueType').val() == "interval") {
 			return false;
 		} else {
 			return true;
 		}
 	} else {
 		if($('#selectInputMeasure').val() == "user" && 
 				$('#valueType').val() == "interval") {
 			return true;
 		} else {
 			return false;
 		}
 	}
 }
 
 /*
  * Il metodo checkCorrectenessInterval verifica che l'intervallo inserito sia 
  * consistente.
  */
 function checkCorrectnessInterval() {
 	if(Number($('#firstValue').val()) < Number($('#secondValue').val())) {
 		return true;
 	} 
 	return false;
 }
 
 /*
  * Il metodo isEmptyCheck controlla che ci sia almento una contromisura 
  * selezionata.
  */
 function isEmptyCheck() {
 	if($('#checkRepeatMeasure').prop('checked') 	  || 
 			$('#checkControlMeasure').prop('checked') ||
 			$('#checkExcludeData').prop('checked')) {
 		return false;
 	} 
 	return true;
}

/*
 * La funzione updateSelectCardinalityRef consente di mostrare i giusti form 
 * in base alla cardinalità dei dati di riferimento.
 */
function updateSelectCardinalityRef() {
	if ($('#selectCardinalityRef option:selected').val() == "many") {
		$('#operationRef').show();
	} else {
		$('#operationRef').hide();
	}
}

/*
 * La funzione updateSelectInputMeasure mostra il corretto form in base al tipo
 * di input della misura di confronto.
 */
function updateSelectInputMeasure() {
	if ($('#selectInputMeasure option:selected').val() == "measure") {
		$('#blockMeasureReference').show();
		$('#blockUserDefined').hide();
	} else {
		$('#blockMeasureReference').hide();
		$('#blockUserDefined').show();
	}
}

/*
 * La funzione updateValueType consente di mostrare il giusto form da compilare in 
 * base al tipo di valore selezionato.
 */
function updateValueType() {
	if ($('#valueType option:selected').val() == "single") {

		$('#singleValueForm').show();
		$('#intervalValue').hide();
	} else {
		$('#singleValueForm').hide();
		$('#intervalValue').show();
	}
}