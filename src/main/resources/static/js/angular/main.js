/**
 * Created by ovidiudanielbarba on 17/07/2017.
 */


var app = angular.module("main",[]);

app.controller("navBar",function ($scope,$http) {
    $scope.tabs = {
        str_plan : "Strategic Plans",
        measurement_plan : "Measurement Plans",
        issue_message : "Issue Message",
        terminate_workflow: "Terminate a Workflow"
    };

    //$http.get()
});
