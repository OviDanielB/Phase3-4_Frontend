
var phase3BackEnd = {
	'host' : 'http://localhost:8081',
	'war' : ''
}

var phase4BackEnd = {
	'host' : 'http://localhost:8082',
    'war' : ''
}

var webAppFrontEndconfig = {
	'host' : 'http://localhost',
	'war' : '',
	'port' : '8080',
	'page_system_state' : 'pages-state-not-ready.html',
	'page_task_execution' : '/task-execution.html'
}


function getPhase3URL() {
	return phase3BackEnd.host + phase3BackEnd.war;
}

function getPhase4URL() {
	return phase4BackEnd.host + phase4BackEnd.war;
}

// FrontEnd getter
function getUrlFrontEnd() {
	return webAppFrontEndconfig.host + ':' + webAppFrontEndconfig.port + webAppFrontEndconfig.war;
}

function getPageTaskExecution() {
	return webAppFrontEndconfig.page_task_execution;
}


function getFrontbasePath() {
	return webAppFrontEndconfig.war;
}

var loginPageUri = "http://localhost:8084/index.html";
var MeasurementPlanPathNoEdit = "measurement-plan-no-edit.html";

function getLoginPageUri() {
	return loginPageUri;
}

function getMeasurementPlanPathNoEdit(modelId, name) {
	return MeasurementPlanPathNoEdit + "?modelId=" + modelId + "&name=" + name;
}
