/**
 * Created by ovidiudanielbarba on 20/07/2017.
 */


var app = angular.module("measurementPlanModule",[]);
app.controller("ontologyController", ontologyController);


function errorCallback(response) {
    console.log(response.statusText);
}

var name = getURLParameter('name');
var modelId = getURLParameter('modelId');

function ontologyController($scope, $http) {

    $scope.tasks = [];
    $scope.metrics = [];
    $scope.attributes = [];
    $scope.groups = [];

    $scope.selected = {
        metric : "metric"
    };

    $http.get(getPhase3URL()+ "/ontologies").then(function (response) {

        $scope.ontology= response.data;
        $scope.attributes = [];

        /* fill available metrics */
        i = 0;
        var onts = response.data;
        for(i; i<onts.length; i++){
            console.log(onts[i]);
            $scope.metrics.push({
                measurementModel: onts[i].measurementModel,
                scale: onts[i].scale,
                unit: onts[i].unit,
                internals: onts[i].internals,
                externals: onts[i].externals

            });

            onts[i].internals.forEach(function (e) {
                $scope.attributes.push(e);
            });
            onts[i].externals.forEach(function (e) {
                $scope.attributes.push(e);
            });


        }
    },errorCallback);

    $http.get(getPhase3URL() + "/measurement-plan",{
        params : {"modelId": modelId}
    }).then(function (response) {

        $scope.groups = response.data.groups;
        $scope.workflowData = response.data.workflowData;

        console.log("ANGULAR" + JSON.stringify(response.data));
        var tasks = response.data.flowElements;
        tasks.forEach(function (task) {

            $scope.tasks.push(task);
        })
    },errorCallback);

}