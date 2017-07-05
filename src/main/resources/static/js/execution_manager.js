var list;
var jsonData;
var idTask; 

$(document).ready(function(){
	checkSystemState();
	getProcesses(); 
});

function getProcesses(){
	var urlto = get3242Path() + get3242basePath()+ "/activiti/processes/kermit/kermit";
	 $.ajax({
		 url: urlto
	        	
	    }).then(function(data) {
	    	jsonData= JSON.parse(JSON.stringify(data));
	    	console.log(jsonData.activitiProcess);
	    	table = $('#listProcesses').DataTable( {

	    		data: jsonData.activitiProcess,
	    	    columns: [
	    	              { data: 'id' },
	    	              { data: 'name' }
	    	          ]
	    	,"autoWidth": true,
	  
	    	});

	    	var path = getFrontbasePath()+"/execution-manager-view.html";
	    	$("#process-view").load(path);
	    	
	    	$('#listProcesses tbody').on('click', 'tr', function () {
	    		
	    		$('#titleMenu').html("<p><strong>Istanza del processo in esecuzione</strong></p>");
	    		
	    		if(table.row( this ).data()['name']!=null){
	    			$('#process-name').html("<p><strong>Process Name: </strong>"+table.row( this ).data()['name']+"</p>");
	    		}
	    		else{
	    			$('#process-name').html("<p><strong>Process Name: </strong>"+"Non è stato assegnato nessun nome al processo"+"</p>");
	    		}
	    		
	    		
	    		if(table.row( this ).data()['activitiProcessAuthor']!=null){
	    			$('#process-author').html("<p><strong>Process author: </strong>"+table.row( this ).data()['activitiProcessAuthor']+"</p>");
	    		}
	    		else{
	    			$('#process-author').html("<p><strong>Process author: </strong>"+"Non è stato assegnato nessun autore del processo"+"</p>");
	    		}
	    		
	    		
	    		if(table.row( this ).data()['version']!=null){
	    			$('#process-version').html("<p><strong>Process Version: </strong>"+table.row( this ).data()['version']+"</p>");
	    		}
	    		else{
	    			$('#process-version').html("<p><strong>Process Version: </strong>"+"Non è stato assegnata nessuna versione al processo"+"</p>");
	    		}
	
	    		if(table.row( this ).data()['description']!=null){
		    		$('#process-description').html("<textarea id=\"textDecription\" style=\"width:100%\" rows=5 wrap=on readonly>"+table.row( this ).data()['description']+
		    				"</textarea>");
	    		}
	    		else{
	    			$('#process-description').html("<textarea id=\"textDecription\" style=\"width:100%\" rows=5 wrap=on readonly>"+"Nessuna descrizione disponibile."+
    				"</textarea>");
	    		}
	    		
	    		$('#faseProcesso').html("<a href="+ get3242Path() + get3242basePath() + "/activiti/" +
	    				"processInstanceState/"+table.row( this ).data()['id']
	    		    +">Visualizza l'immagine a schermo intero</a>");	
	    		
	    		$("#theImg").remove();
	    		$('#img').prepend('<img id="theImg" src= "'+get3242Path() + get3242basePath()+'/activiti/processInstanceState/'+ table.row( this ).data()['id']+'" />');

	    	});
	    	
	    	
	    	});
};
