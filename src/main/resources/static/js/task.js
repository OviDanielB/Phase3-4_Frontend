$(function(){
	/*
	//Check user cookie
	if(getCookie("username") == "kermit"){
		console.log("kermit");
	}
	//if(getCookie("role") != ''){
	*/

	checkSystemState();
	
	var assignee = getAssignee();
	
	var data = {'assignee':assignee};
	
	//if(you_have_permission){
		//Retrieves all unassigned tasks and populates all tasks form 
		getAllTaskUnassigned(data);
		//Retrieves all assigned tasks and populates all tasks form
		getAllTaskAssigned(data);
	/*}
	else
		window.location.href = "pages-error-401.html";*/
});

//Request all task unassigned for a particular role group
function getAllTaskUnassigned(data){
	
	$.ajax({
		url: getUrlBackEnd()+"tasks/unassigned",
		type: 'get',
		contentType : "application/json; charset=utf-8",
		data: data,
		success: function(response){ 
			  
			var taskList = response.data; 
			
			$.each(taskList, function(i, item) {
						
				//Populates unassigned task
				var task = '<div class="task-item task-warning '+item.id+'">'
				                 +'<div class="task-text">'+item.name+'<br><br><span class="fa fa-tag"></span>&nbsp'+item.processDefinitionId+'</div>'
				                 +'<div class="task-footer">'
				                     +'<div class="pull-left"><span class="fa fa-sort-amount-desc"></span>Priority&nbsp'+item.priority+'</div>'
				                 +'</div>'
				             +'</div>';
				$('#tasks').append(task);
				 
				var win = insertInPopUP(item);
				$('#attach_pop_up').append(win);
			 
			});
		 },
		 error: function(err){
			var error = $.parseJSON(err.responseText);
			alert(error.errorCode + " "+ error.message);
		 }
	});
}

//Request all task assigned for a particular role group
function getAllTaskAssigned(data){
	
	$.ajax({
		url: getUrlBackEnd()+"tasks/assigned",
		type: 'get',
		contentType : "application/json; charset=utf-8",
		data: data,
		success: function(response){ 
			  
			var taskList = response.data; 
			
			$.each(taskList, function(i, item) {
					
				//Populates assigned task
   				var task = '<div class="task-item task-warning '+item.id+'">'
				                 +'<div class="task-text">'+item.name+'<br><br><span class="fa fa-tag"></span>&nbsp'+item.processDefinitionId+'</div>'
				                 +'<div class="task-footer">'
				                     +'<div class="pull-left"><span class="fa fa-sort-amount-desc"></span>Priority&nbsp'+item.priority+'</div>'
				                     +'<div class="pull-right"><a href="'+getUrlFrontEnd()+getPageTaskExecution()+'?taskId='+item.id+'"><span class="fa fa-tasks">Execute</span></a></div>'
				                 +'</div>'
				             +'</div>';
   				 $('#tasks_progreess').append(task);
	   				
   				var win = insertInPopUP(item);
   				$('#attach_pop_up').append(win);
   				 
   			});
	
		},
		error: function(err){
			var error = $.parseJSON(err.responseText);
			alert(error.errorCode + " "+ error.message);
	  }
	});
}

//Create pop up and insert item inside
function insertInPopUP(item){
	
	var win = '<div class="message-box message-box-info animated fadeIn" id="box'+item.id+'">'+
		'<div class="mb-container">'+
			'<div class="mb-middle">'+
				'<div class="mb-title">'+
					'<a id="link'+item.id+'" class="mb-control-close" href="javascript:closePopUp('+item.id+')"><span class="fa fa-times"></span></a>'+
					'Complete Task </div>'+
				
				'<div class="mb-content">'+
					'<p>'+
					convert(item.description);
					'</p>'+
				'</div>'+
	
				'</div>'+
			'</div>'+
		'</div>';
	return win;

}

//Close pop up window
function closePopUp(id){

	$(".mb-control-close").on("click",function(){
	    $(this).parents(".message-box").removeClass("open");
	    return false;
	 });

}
