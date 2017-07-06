var list;
var jsonData;
var attrtable,strtablr;

$(document).ready(function(){
	
	var id = urlParam('id');
	 $.ajax({

	        url: getPhase3URL() + "/strategicPlan/getStrategicPlan?id=" + id
	        	//"http://rest-service.guides.spring.io/greeting"
	    }).then(function(data) {
	    	
	    	jsonData= JSON.parse(JSON.stringify(data));
//	    	alert(JSON.stringify(data));
	    	$('h1').append("<b>"+jsonData.name+"</b>");	    	
	    	$('#descriptionrow').append(jsonData.description);
	    	$('#organizationalunitrow').append(jsonData.organizzationalUnit);
	    	$('#versionrow').append(jsonData.version);
	    	$('#releaserow').append(jsonData.release);
	    	
	    	$.ajax({url : getPhase3URL() + "/strategicPlan/getMetaWorkflows?id=" + id
						// "http://rest-service.guides.spring.io/greeting"
				})
				.then(function(data) {
							var result = JSON
									.parse(JSON
											.stringify(data));
							var strategy = new Array();
							for ( var stm in result.strategyToMetaworkflow) {
								
									strategy
											.push(result.strategyToMetaworkflow[stm].strategy);
							}
							strtablr = $(
									'#strategyTable')
									.DataTable(
											{
												data : strategy,
												columns : [
														{
															data : 'name'
														},
														{
															data : 'description'
														},
														{
															data : 'organizational_Unit'
														}
														],
												autoWidth : true,
												

											});
	    	
							attrtable = $('#attributesTable').DataTable( {
	    	    data: jsonData.attributes,
	    	    columns: [
	    	              { data: 'name' },
	    	              { data: 'type' },
	    	              { data: 'value' }
	    	          ]
	    	,"autoWidth": true
	    	
	    	});
	    	
	    	    	
	    }); 

});
});

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function AddAttribute(){
	
	if($("#name").val() !="" && $("#type").val() != "" && $("#value").val() != ""){
	
	var attributes = new Array();
	var p = jsonData.attributes;
	if (p != undefined){
		
		for(var i = 0; i < table.rows().data().length; i++) {
			attributes.push(table.rows().data()[i]);		
		}
		
	}
	
	var r = Math.random() * (100000000000000000 - 1) + 1;
    var attr = {
    		id: r,
            name: $("#name").val(),
            type: $("#type").val(),
            value: $("#value").val(),
        }
	
	attributes.push(attr);

	jsonData.attributes = attributes;
	
	$.ajax({

        url: getPhase3URL() + '/strategicPlan/updateStrategicPlan',
       type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(jsonData)
    });
	alert("L'attributo è stato aggiunto correttamente");
	window.location.reload();
	
	}
	else {
		alert("Hai lasciato campi vuoti! Devi completare tutti i campi per aggiungere un attributo")
	}
}


function deleteAttribute(){
	
	var attributes = new Array();
	var p = jsonData.attributes;

	if (p != undefined){
		
		/*attributo selezionato da eliminare*/
		if( table.rows('.selected').data().length != 0) {
			
			/*attributo selezionato*/
			var s = table.rows('.selected').data()[0];

			/*attributi gia esistenti*/
			for(var x = 0; x < table.rows().data().length; x++) {
				attributes.push(table.rows().data()[x]);		
			}
			/*ricerca attributo*/
			for(var j = 0; j < table.rows().data().length; j++) {
				if(attributes[j].id == s.id){
				attributes.splice(j, 1);	
				break;		
				}		
			}
			
			jsonData.attributes = attributes;
			
			$.ajax({

		        url: getPhase3URL() + '/strategicPlan/updateStrategicPlan',
		        type: 'post',
		        contentType: 'application/json',
		        data: JSON.stringify(jsonData)
		    });
			
			alert("L'attributo è stato eliminato correttamente");
			window.location.reload();
			
		}
		else {
			
			alert("Non hai selezionato nessun elemento");
			
		}
	
	}else{
		
		alert("Non ci sono elementi da poter eliminare");
	}	
	
}





function updateAttribute(){
	
	var attributes = new Array();
	var p = jsonData.attributes;

	if (p != undefined){
		
		/*attributo selezionato da modificare*/
		if( table.rows('.selected').data().length != 0) {
			
			/*attributo selezionato*/
			var s = table.rows('.selected').data()[0];

			/*attributi gia esistenti*/
			for(var x = 0; x < table.rows().data().length; x++) {
				attributes.push(table.rows().data()[x]);		
			}
			var name = null;
			var type = null;
			var value = null;
			
			if($("#name").val() != "" && $("#type").val() == "" && $("#value").val() == ""){
				name=$("#name").val();
				type = s.type;
				value = s.value;
			}else if ($("#name").val() != "" && $("#type").val() != "" && $("#value").val() == ""){
				name=$("#name").val();
				type = $("#type").val();
				value = s.value;
			}else if($("#name").val() != "" && $("#type").val() != "" && $("#value").val() != ""){
				name=$("#name").val();
				type = $("#type").val();
				value = $("#value").val();
			}else if($("#name").val() != "" && $("#type").val() == "" && $("#value").val() != ""){
				name=$("#name").val();
				type = s.type;
				value = $("#value").val();
			}else if($("#name").val() == "" && $("#type").val() != "" && $("#value").val() != ""){
				name=s.name;
				type = $("#type").val();
				value = $("#value").val();
			}else if($("#name").val() == "" && $("#type").val() == "" && $("#value").val() != ""){
				name=s.name;
				type = s.type;
				value = $("#value").val();
			}else if($("#name").val() == "" && $("#type").val() != "" && $("#value").val() == ""){
				name=s.name;
				type = $("#type").val();
				value = s.value;
			}
			
			if($("#name").val() != "" || $("#type").val() != "" || $("#value").val() != ""){
				var newAttribute = {
						id: s.id,
						name: name,
						type: type,
						value: value,
		        	}
			
				/*ricerca attributo*/
				for(var j = 0; j < table.rows().data().length; j++) {
					if(attributes[j].id == s.id){
						attributes[j] = newAttribute;	
						break;		
					}		
				}
			
				jsonData.attributes = attributes;
			
				$.ajax({
					url: getPhase3URL() + '/strategicPlan/updateStrategicPlan',
					type: 'post',
					contentType: 'application/json',
					data: JSON.stringify(jsonData)
				});
			
				alert("L'attributo è stato modificato correttamente");
				window.location.reload();
			}
			else{
				alert("Devi inserire almeno un campo per modificare un attributo!");
			}
		}
		else {
			
			alert("Non hai selezionato nessun elemento");
			
		}
	
	}else{
		
		alert("Non ci sono elementi da poter modificare");
	}	
	
}
