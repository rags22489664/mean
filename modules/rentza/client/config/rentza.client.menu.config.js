'use strict';

angular.module('rentza').run(['Menus',
  function (Menus) {
  
    Menus.addMenuItem('topbar', {
      title: 'Rentza',
      state: 'rentza',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'rentza', {
      title: 'Maps',
      state: 'rentza.maps'
    });

  }
]);
