var table;
var jsonData;
$(document).ready(function() {
	checkSystemState();

	var urlto = get3242Path() + get3242basePath()+ "/strategy/getStrategies";
    $.ajax({

        url: urlto

        	//"http://rest-service.guides.spring.io/greeting"
    }).then(function(data) {
    	jsonData= JSON.parse(JSON.stringify(data));
    	console.log(jsonData.strategies);
    	table = $('#myTable').DataTable( {
    	    data: jsonData.strategies,
    	    columns: [
    	              { data: 'name' },
    	              { data: 'description' },
    	              { data: 'version' },
    	              { data: 'release' },
    	              { data: 'organizationalunit' }
    	          ]
    	,"autoWidth": true
    	

    	    
    	});	
    	
    });
});