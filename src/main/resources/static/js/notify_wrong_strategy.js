var id;

$(document).ready(function(){
	
	id = urlParam('id');
	$('#alert').click(function() {
	    window.location.href = getPhase3URL() + "/notify/alertPhase2?id="+id;
	    return false;
	});
	$('#strategicPlan').click(function() {
	    window.location.href = "strategic-plans.html";
	    return false;
	});
});


function urlParam(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)')
			.exec(window.location.href);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}