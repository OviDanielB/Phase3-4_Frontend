//Get parameters from link
function getURLParameter(name) {
	
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}

//Retrieve an URL inside a Sting and transform this URL in a href
function convert(text) {
	  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  var text1=text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
	  var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
	  return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
	  
}

//Retrieve an URL inside a Sting
function getURL(text) {
    var testUrl = text.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
	if (testUrl == null) {
		return null;
	} else {
	    return testUrl[0];
	}
}

//Check if the system is ready to use
function checkSystemState() {
	
	// $.ajax({
	// 	url : getUrlBackEnd() + 'systemstate/',
	// 	type : 'get',
	// 	contentType : "application/json; charset=utf-8",
	// 	dataType : "json",
	// 	success : function(systemstate) {
	// 		var state = systemstate.state;
	// 		if(state == 0) {
	// 			var url = getUrlFrontEnd() + getPageSystemState();
	// 			$(location).attr("href", url);
	// 		}
	// 	},
	// 	error : function(response) {
	// 		alert("Error during get system state");
	// 	}
	// });
}

function logoutFunction(){
	
	document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.location = getLoginPageUri();
}