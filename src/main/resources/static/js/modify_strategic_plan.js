var list;
var jsonData;
var table;
var windowName;
var windowType;
var windowValue;
var windowDescription;
var windowVersion;
var windowRelease;
var p;
var name;
var type;
var value;
var id = urlParam('id');
$(document).ready(function(){
	 checkSystemState();
	 //alert(urlParam('id'));
	 id = urlParam('id');
	
	 $.ajax({
		 	url: get3242Path() + get3242basePath() + "/strategicPlan/getStrategicPlan?id=" + id
	        	
	    }).then(function(data) {
	    	
	    	jsonData= JSON.parse(JSON.stringify(data));
//	    	alert(JSON.stringify(data));
	    	$('h1').append("<b>"+jsonData.name+"</b>");
	    	$('#descriptionrow').append(jsonData.description);
	    	$('#organizationalunitrow').append(jsonData.organizzationalUnit);
	    	$('#versionrow').append(jsonData.version);
	    	$('#releaserow').append(jsonData.release);
	    	
	    	table = $('#attributesTable').DataTable( {
	    	    data: jsonData.attributes,
	    	    columns: [
	    	              { data: 'name' },
	    	              { data: 'type' },
	    	              { data: 'value' },
	    	              {}
	    	          ],
	    	"autoWidth": true,
	    	columnDefs : [ {
				targets : -1,
				data : null,

				defaultContent : "<button id='editsp' class='glyphicon glyphicon-pencil'/><button id='deletesp' class='glyphicon glyphicon-remove'/>"
			}],

	    	});
    	
	    	
	    	
	    	$('#attributesTable tbody').on( 'click', 'tr', function () {
	    		str = JSON.stringify(table.row( this ).data());
	    		url = getFrontbasePath()
				+ "/strategic-plan.html?id=";
	    		//window.location.href = url+escape(table.row(this).data()['id']);           
	        } );	    	
	    	
	    	
	    	/*delete Attribute*/
	    	
	    	$('#attributesTable').on( 'click', '#deletesp', function (e) {
	    		e.stopPropagation();
	    		var clickedattribute =table.row( $(this).parents('tr') ).data();
	    		var attributes = new Array();
	    		var p = jsonData.attributes;

	    		/*attributi gia esistenti*/
	    		for(var x = 0; x < table.rows().data().length; x++) {
	    			attributes.push(table.rows().data()[x]);		
	    		}
	    		/*ricerca attributo*/
	    		for(var j = 0; j < table.rows().data().length; j++) {
	    		   if(attributes[j].id == clickedattribute.id){
	    				attributes.splice(j, 1);	
	    				break;		
	    			}		
	    		}
	    				
	    		jsonData.attributes = attributes;
	    			
	    		var urlto = get3242Path() + get3242basePath() + "/strategicPlan/updateStrategicPlan";
	    		$.ajax({

	    			 url: urlto,
	    			 type: 'post',
	    			 contentType: 'application/json',
	    			 data: JSON.stringify(jsonData)
	    	     });
	    				
	    		alert("L'attributo è stato eliminato correttamente");
	    		//window.location.replace("strategicPlans.html");
	    		location.reload();

		    } );
	    	

	    	/*edit Attribute*/
	    	
	    	$('#attributesTable').on( 'click', '#editsp', function (e) {
	    		var clickedsAttribute =table.row( $(this).parents('tr') ).data(); /*attributo selezionato da modificare*/
	    		 p = jsonData.attributes;
	    			var statesdemo = {
	    					state0: {
	    						title: 'Update attribute',
	    						html:'<p></p><label>Name <input type="text" name="name" value=""></label><br /><label>Type <input type="text" name="type" value=""></label><br /><label>Value <input type="text" name="value" value=""></label><br />',
	    						buttons: { ok: true , "don't update":false},
	    						//focus: "input[name='fname']",
	    						submit:function(e,v,m,f){
	    							if(v){
	    							windowName= f.name;
	    							console.log(f.name);
	    							
	    							windowType= f.type;
	    							console.log(f.type);
	    							
	    							windowValue= f.value;
	    							console.log(f.value);
	    							
	    							e.preventDefault();
	    							$.prompt.goToState('state1', true);
	    							return false;
	    							
	    							}
	    							$.prompt.close();
	    						}
	    					},
	    					state1: {
	    						html:'Are you sure to update the attribute?',
	    						buttons: { No: false, Yes: true },
	    						focus: 1,
	    						submit:function(e,v,m,f){
	    							e.preventDefault();
	    							if(v){
	    								$.prompt.close();
	    								
	    								var attributes = new Array(); /*attributi già esistenti*/
	    								/*attributi gia esistenti*/
	    								for(var x = 0; x < table.rows().data().length; x++) {
	    									attributes.push(table.rows().data()[x]);		
	    								}
	    								
	    								
	    								if(windowName != "" && windowType == "" && windowValue == ""){
	    									name=windowName;
	    									type = clickedsAttribute.type;
	    									value = clickedsAttribute.value;
	    								}else if (windowName != "" && windowType != "" && windowValue == ""){
	    									name=windowName;
	    									type = windowType;
	    									value = clickedsAttribute.value;
	    								}else if(windowName != "" && windowType != "" && windowValue != ""){
	    									name=windowName;
	    									type = windowType;
	    									value = windowValue;
	    								}else if(windowName != "" && windowType == "" && windowValue != ""){
	    									name=windowName;
	    									type = clickedsAttribute.type;
	    									value = windowValue;
	    								}else if(windowName == "" && windowType != "" && windowValue != ""){
	    									name=clickedsAttribute.name;
	    									type = windowType;
	    									value = windowValue;
	    								}else if(windowName == "" && windowType == "" && windowValue != ""){
	    									name=clickedsAttribute.name;
	    									type = clickedsAttribute.type;
	    									value = windowValue;
	    								}else if(windowName == "" && windowType != "" && windowValue == ""){
	    									name=clickedsAttribute.name;
	    									type = windowType;
	    									value = clickedsAttribute.value;
	    								}
	    								
	    								if(windowName != "" || windowType != "" || windowValue != ""){
	    									var newAttribute = {
	    											id: clickedsAttribute.id,
	    											name: name,
	    											type: type,
	    											value: value,
	    							        	}
	    								
	    									/*ricerca attributo*/
	    									for(var j = 0; j < table.rows().data().length; j++) {
	    										if(attributes[j].id == clickedsAttribute.id){
	    											attributes[j] = newAttribute;	
	    											break;		
	    										}		
	    									}
	    								
	    									jsonData.attributes = attributes;
	    								
	    									var urlto = get3242Path() + get3242basePath() + "/strategicPlan/updateStrategicPlan";
	    									$.ajax({
	    										url: urlto,
	    										type: 'post',
	    										contentType: 'application/json',
	    										data: JSON.stringify(jsonData)
	    									}).then(function(sp) {
	    										
	    										alert("L'attributo è stato modificato correttamente");	
	    										window.location.reload();
	    										
	    									});

	    								}
	    								else{
	    									alert("Devi inserire almeno un campo per modificare un attributo!");
	    								}
	    								
	    								
	    								}
	    							else 
	    								$.prompt.goToState('state0');
	    						}
	    					}
	    					};
	    			$.prompt(statesdemo);	

	    		
	
		    } );
	    		
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

function viewStrategies(){
	
	url = getFrontbasePath()
	+ "/modify-strategies.html?id=";
	window.location.href = url+id;
}

function modifyStrategicPlan() {
	

	var holdname = jsonData.name;
	var holddescription = jsonData.description;
	var holdversion = jsonData.version;
	var holdrelease = jsonData.release;
	
	var statesdemo = {
			state0: {
				title: 'Modify Strategic Plan',
				html:'<p></p><label>Name <input type="text" name="name" value=""></label><br /><label>Description <input type="text" name="description" value=""></label><br /><label>Version <input type="text" name="version" value=""></label><br /><label>Release <input type="text" name="release" value=""></label><br />',
				buttons: { ok: true , "don't create":false},
				//focus: "input[name='fname']",
				submit:function(e,v,m,f){
					if(v){
					windowName= f.name;
					console.log(f.name);
					
					windowDescription= f.description;
					console.log(f.description);
					
					windowVersion= f.version;
					console.log(f.version);
					
					windowRelease= f.release;
					console.log(f.release);
					
					e.preventDefault();
					$.prompt.goToState('state1', true);
					return false;
					
					}
					$.prompt.close();
				}
			},
			state1: {
				html:'Are you sure to update the Strategic Plan?',
				buttons: { No: false, Yes: true },
				focus: 1,
				submit:function(e,v,m,f){
					e.preventDefault();
					if(v){
						$.prompt.close();
						
						if(windowName != "" || windowDescription != "" || windowVersion != "" || windowRelease != "" ){
							
							if(windowName != "" && windowDescription == "" && windowVersion == "" && windowRelease == "" ){
								jsonData.name=windowName;
								
							}else if (windowName != "" && windowDescription != "" && windowVersion == "" && windowRelease == "" ){
								jsonData.name=windowName;
								jsonData.description = windowDescription;
							}else if(windowName != "" && windowDescription != "" && windowVersion != "" && windowRelease == "" ){
								jsonData.name=windowName;
								jsonData.description = windowDescription;
								jsonData.version = windowVersion;
							}else if(windowName != "" && windowDescription == "" && windowVersion != "" && windowRelease == "" ){
								jsonData.name=windowName;
								jsonData.version = s.type;
							}else if(windowName == "" && windowDescription != "" && windowVersion != "" && windowRelease == "" ){
								jsonData.description = windowDescription;
								jsonData.version = windowVersion;
							}else if(windowName == "" && windowDescription == "" && windowVersion != "" && windowRelease == "" ){
								jsonData.version = windowVersion;
							}else if(windowName == "" && windowDescription != "" && windowVersion == "" && windowRelease == "" ){
								jsonData.description = windowDescription;
							}else if(windowName == "" && windowDescription == "" && windowVersion == "" && windowRelease != "" ){
								jsonData.release = windowRelease;
							}else if(windowName != "" && windowDescription != "" && windowVersion == "" && windowRelease != "" ){
								jsonData.name=windowName;
								jsonData.description = windowDescription;
								jsonData.release = windowRelease;
							}else if(windowName == "" && windowDescription != "" && windowVersion != "" && windowRelease != "" ){
								jsonData.version=windowVersion;
								jsonData.description = windowDescription;
								jsonData.release = windowRelease;
							}else if(windowName != "" && windowDescription == "" && windowVersion != "" && windowRelease != "" ){
								jsonData.version=windowVersion;
								jsonData.name = windowName;
								jsonData.release = windowRelease;
							}else if(windowName != "" && windowDescription == "" && windowVersion == "" && windowRelease != "" ){
								jsonData.name = windowName;
								jsonData.release = windowRelease;
							}else if(windowName == "" && windowDescription != "" && windowVersion == "" && windowRelease != "" ){
								jsonData.description = windowDescription;
								jsonData.release = windowRelease;
							}else if(windowName == "" && windowDescription == "" && windowVersion != "" && windowRelease != "" ){
								jsonData.version = windowVersion;
								jsonData.release = windowRelease;
							}
							else if(windowName != "" && windowDescription != "" && windowVersion != "" && windowRelease != "" ){
								jsonData.name = windowName;
								jsonData.description = windowDescription;
								jsonData.version = windowVersion;
								jsonData.release = windowRelease;
							}
							
					   var urlto = get3242Path() + get3242basePath() + "/strategicPlan/updateStrategicPlan";	
						$.ajax({
							
							url: urlto,
						    type: 'post',
						    contentType: 'application/json',
						    data: JSON.stringify(jsonData)

						}).then(function(sp) {
							
							alert("Il piano strategico è stato modificato correttamente");
							window.location.reload();
						});
						}else{
							
							alert("Devi inserire almeno un campo per modificare il piano strategico!");
						}
					}
					else 
						$.prompt.goToState('state0');
				}
				}
			};
	$.prompt(statesdemo);	
}


function addAttribute(){
    p = jsonData.attributes;
	var statesdemo = {
			state0: {
				title: 'Generate new attribute',
				html:'<p></p><label>Name <input type="text" name="name" value=""></label><br /><label>Type <input type="text" name="type" value=""></label><br /><label>Value <input type="text" name="value" value=""></label><br />',
				buttons: { ok: true , "don't create":false},
				//focus: "input[name='fname']",
				submit:function(e,v,m,f){
					if(v){
					windowName= f.name;
					console.log(f.name);
					
					windowType= f.type;
					console.log(f.type);
					
					windowValue= f.value;
					console.log(f.value);
					
					e.preventDefault();
					$.prompt.goToState('state1', true);
					return false;
					
					}
					$.prompt.close();
				}
			},
			state1: {
				html:'Are you sure to create a new attribute for the Strategic Plan?',
				buttons: { No: false, Yes: true },
				focus: 1,
				submit:function(e,v,m,f){
					e.preventDefault();
					if(v){
						$.prompt.close();
						
						var r = Math.random() * (100000000000000000 - 1) + 1;
					    var attr = {
					    		id: r,
					            name: windowName,
					            type: windowType,
					            value: windowValue,
					        }
						
					    p.push(attr);
					    jsonData.attributes = p;
					    
					    var urlto = get3242Path() + get3242basePath() + "/strategicPlan/updateStrategicPlan";
						$.ajax({
							
							url: urlto,
						    type: 'post',
						    contentType: 'application/json',
						    data: JSON.stringify(jsonData)

						}).then(function(sp) {
							
							alert("L'attributo è stato creato correttamente");
							window.location.reload();
						});
						}
					else 
						$.prompt.goToState('state0');
				}
			}
			};
	$.prompt(statesdemo);
	
}