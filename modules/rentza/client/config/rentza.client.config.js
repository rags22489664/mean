'use strict';

angular.module('rentza').config(['uiGmapGoogleMapApiProvider', '$stateProvider',
  function (uiGmapGoogleMapApiProvider, $stateProvider) {

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAwdD3Bqi1Lxwp-CvzlqmqFfcXr2wCNFUY',
        libraries: 'weather,geometry,visualization'
    });

    $stateProvider
      .state('rentza', {
        abstract: true,
        url: '/rentza',
        template: '<ui-view/>'
      }).state('rentza.maps', {
        url: '/maps',
        templateUrl: 'modules/rentza/client/views/rentza.maps.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
