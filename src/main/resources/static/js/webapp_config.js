
var phase3BackEnd = {
	'host' : 'http://localhost:8083',
    'war' : ''
    // 'war' : '/gqm3'
}

var phase4BackEnd = {
	'host' : 'http://localhost:8084',
    'war' : ''
    // 'war' : '/gqm4'
}

var webAppFrontEndconfig = {
	'host' : 'http://localhost',
	// 'war' : '/webapp-phases-34',
	'war' : '',
	'port' : '8082',
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

var loginPageUri = "http://localhost:8080/Integrazione/index.html";
var MeasurementPlanPath = "measurement-plan.html";

function getLoginPageUri() {
	return loginPageUri;
}

function getMeasurementPlanPath(modelId, name) {
	return MeasurementPlanPath + "?modelId=" + modelId + "&name=" + name;
}
