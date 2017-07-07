var list;
var jsonData;
$(document).ready(function() {
	var urlto= getPhase3URL() + "/strategicPlan/getStrategicPlans";
    $.ajax({
        url: urlto
        	//"http://rest-service.guides.spring.io/greeting"
    }).then(function(data) {
    	jsonData= JSON.parse(JSON.stringify(data));
    	console.log(jsonData.strategicPlans);
    	var table = $('#myTable').DataTable( {
    	    data: jsonData.strategicPlans,
    	    columns: [
    	              { data: 'name' },
    	              { data: 'description' },
    	              { data: 'version' },
    	              { data: 'release' },
    	              { data: 'organizationalUnit' },
    	              {}
    	          ],
    	"autoWidth": true,
    	columnDefs : [ {
			targets : -1,
			data : null,

			defaultContent : "<button id='editsp' class='glyphicon glyphicon-pencil'/> <button id='deletesp' class='glyphicon glyphicon-remove'/><button id='addwftosp' class='glyphicon glyphicon-object-align-vertical'>Add Workflow </button>"
		}],
		    	    
    	});
    	
    	
    	$('#myTable tbody').on('click', 'tr', function () {
    	
    		str = JSON.stringify(table.row( this ).data());
   		 	//url= "modifyStrategicPlan.html?id=";
    		url= getFrontbasePath()+"/strategicPlan.html?id=";
            //window.location.href = url+escape(table.row( this ).data()['id']);
   		    window.location.href = url;
          
        } );
    	
    	$('#myTable tbody').on( 'click', '#editsp', function (e) {
    		e.stopPropagation();
    		var clickedtrategicPlan =table.row( $(this).parents('tr')).data();
    		//alert( JSON.stringify(clickedtrategicPlan) );
    		url= getFrontbasePath()+"/strategic-plan.html?id=";
    		window.location.href = url+clickedtrategicPlan['id'];
	       
	    } );
    	
    	$('#myTable tbody').on( 'click', '#deletesp', function (e) {
    		e.stopPropagation();
    		var clickedstrategicPlan =table.row( $(this).parents('tr') ).data();
    		//alert( JSON.stringify(clickedstrategicPlan) );
    		url= getPhase3URL() + "/strategicPlan/deleteStrategicPlan?id=";
    		$.ajax({
    	        url: url+clickedstrategicPlan['id']
    	        	//"http://rest-service.guides.spring.io/greeting"
    	    })
    	    window.location.replace("strategicPlans.html");
	       
	    } );
    		
    	$('#myTable tbody').on( 'click', '#addwftosp', function (e) {
    		e.stopPropagation();
    		var clickedstrategicPlan =table.row( $(this).parents('tr') ).data();
    		url= getFrontbasePath()+"/workflow-management.html?id=";
    		window.location.href = url+clickedstrategicPlan['id'];
	        
	    } );
    	
    	
	
    });
});

function onRowClick(id){
	
	alert("id " + id);
	
}

