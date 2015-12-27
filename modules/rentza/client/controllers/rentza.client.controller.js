'use strict';

angular.module('rentza').controller('RentzaController', ['$scope',
  function ($scope) {
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };    
  }
]);
