/**
 * Created by ovidiudanielbarba on 21/07/2017.
 */

var app = angular.module("validateModule",[]);
app.controller("validateController",validateController);

function validateController($scope,$http) {

    var runtimeTaskId = getURLParameter("runtimeTaskId");
    var taskId = getURLParameter("taskId");
    var validationId = getURLParameter("validationId");
    $scope.collectedData=[];

    updateCollectedData();

    $scope.completeValidation = function () {
        $.ajax({
            'url' : getPhase4URL() + "validation/completeValidation?taskId="
            + taskId + "&validationOpId=" + getURLParameter("validationId"),
            'type' : 'get',
            'contentType' : "application/json; charset=utf-8",
            'dataType' : "json",

            success : function(response) {
                //window.location.href = getUrlFrontEnd();
                /* go to remaining validation op list */
                window.location.href = getUrlFrontEnd() +"/execute-validation.html?runtimeTaskId=" +
                    runtimeTaskId + "&taskId="+ taskId;
            },
            error : function(response) {
                alert(response.errorCode + " " + response.message);
            }
        });
    };

    $http.get(getPhase4URL() + '/validation/validationOp?id=' + validationId)
        .then(function (response) {

            console.log("ANGULAR " + response.data);
            $scope.validOp = response.data;
        },function (error) {
            console.log(error);
        });

    function updateCollectedData() {
        $http.get(getPhase4URL() + '/collected-data-by-task', {params: {taskId: taskId}})
            .then(function (response) {

                var dataList = response.data;
                /* empty array of collected data */
                $scope.collectedData = [];
                dataList.forEach(function (ele) {
                    $scope.collectedData.push(ele);
                });

            }, function (error) {
                console.log(error);
            });
    }
}