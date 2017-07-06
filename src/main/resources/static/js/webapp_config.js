var webAppBackEndconfig = {

	'host' : 'http://localhost',
	'war' : '/gqm3141webapp/',
	'port' : '8080'
}

var phase3BackEnd = {
	'host' : 'http://localhost:8080',
	'war' : '/gqm_phase3'
}

var phase4BackEnd = {
	'host' : 'http://localhost:8080',
    'war' : '/gqm_phase4'
}

var webAppFrontEndconfig = {
	'host' : 'http://localhost',
	'war' : '/webapp-phases-34/',
	'port' : '8080',
	'page_system_state' : 'pages-state-not-ready.html',
	'page_task_execution' : 'task-execution.html'
}


function getPhase3URL() {
	return phase3BackEnd.host + phase3BackEnd.war;
}

function getPhase4URL() {
	return phase4BackEnd.host + phase4BackEnd.war;
}

// BackEnd getter
function getUrlBackEnd() {
	return (webAppBackEndconfig.host + ':' + webAppBackEndconfig.port + webAppBackEndconfig.war);
}

// FrontEnd getter
function getUrlFrontEnd() {
	return (webAppFrontEndconfig.host + ':' + webAppFrontEndconfig.port + webAppFrontEndconfig.war);
}

function getPageSystemState() {
	return webAppFrontEndconfig.page_system_state;
}

function getPageTaskExecution() {
	return webAppFrontEndconfig.page_task_execution;
}

var gqm3242 = {

	'URL' : 'http://localhost',
	'port' : '8080',
	'basePath' : '/gqm32',
	'path' : 'http://localhost:8080'
}

function get3242Url() {
	return gqm3242.URL;
}

function get3242Port() {
	return gqm3242.port;
}

function get3242basePath() {
	return gqm3242.basePath;
}

function get3242Path() {
	return gqm3242.path;
}

var frontend = {

	'URL' : 'http://localhost',
	'port' : '8080',
	'basePath' : '/webapp-phases-34'

}

function getFrontUrl() {
	return frontend.URL;
}

function getFrontPort() {
	return frontend.port;
}

function get3242BackEnd() {
	return (gqm3242.URL + gqm3242.basePath);
}

function getFrontbasePath() {
	return frontend.basePath;
}

var loginPageUri = "http://localhost:8081/index.html";
var MeasurementPlanPathNoEdit = "measurement-plan-no-edit.html";

function getLoginPageUri() {
	return loginPageUri;
}

function getMeasurementPlanPathNoEdit(modelId, name) {
	return MeasurementPlanPathNoEdit + "?modelId=" + modelId + "&name=" + name;
}
