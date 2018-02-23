/**
 * Created by ovidiudanielbarba on 21/07/2017.
 */


var app = angular.module("measurementCollectionModule",[]);
app.controller("measurementCollectionController",measurementCollectionController);
app.controller("measurementRepeatController",measurementRepeatController);

function measurementRepeatController($scope,$http) {
    $scope.name = "Measurement Repeat";
}

function measurementCollectionController($scope,$http) {

    var name = getURLParameter('name');
    var taskId = getURLParameter('taskId');
    var runtimeTaskId = getURLParameter('runtimeTaskId');

    $scope.name = name;
    $scope.collectedData = [];
    /* new measurement to be inserted and saved */
    $scope.currentCollected = {};

    updateCollectedData();


    $scope.updateData = updateCollectedData();

    $scope.collectAndSaveMeasurement = function (collected) {
        var collected_data = {};
        var workflowData = {};

        //Prepare collected data to send
        collected_data.workflowData = workflowData;
        collected_data.taskId = taskId;
        if(collected != null){
            //collected_data.value = collected.newValue;
            collected_data = collected;
            if(collected_data.newValue != null){
                collected_data.value = collected.newValue;
            }
        } else {
            collected_data.value = $scope.currentCollected.value;
        }
        collected_data.validated = false;

        console.log(collected_data);
        $http.post(getPhase4URL()+'/measurement-collection?runtimeTaskId=' + runtimeTaskId, collected_data)
            .then(function (success) {

                updateCollectedData();
                $scope.currentCollected = {};
            },function (error) {

            });

    };

    var data = {
        'taskId' : taskId,
        'runtimeTaskId' : runtimeTaskId
    };



    $http.get(getPhase4URL() + '/measurement-collection/', {params : data}).then(
                function (response) {
                    console.log("ANGULAR " + JSON.stringify(response.data));

                    $scope.task = response.data;
                },function (error) {

        });

    function updateCollectedData() {
        $http.get(getPhase4URL() + '/collected-data-by-task', {params: {taskId: taskId}})
            .then(function (response) {

                var dataList = response.data;
                /* empty array of collected data */
                $scope.collectedData = [];
                dataList.forEach(function (ele) {
                    $scope.collectedData.push(ele);
                    console.log(JSON.stringify(ele));
                });

            }, function (error) {
                console.log(error);
            });
    }
}