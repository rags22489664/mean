'use strict';

/**
 * Module dependencies.
 */
var rentzaPolicy = require('../policies/rentza.server.policy'),
  rentza = require('../controllers/rentza.server.controller');

module.exports = function (app) {
  // rentza collection routes
  app.route('/api/listings').all(rentzaPolicy.isAllowed)
    .get(rentza.list)
    .post(rentza.create);

  // Single listing routes
  app.route('/api/listings/:listingId').all(rentzaPolicy.isAllowed)
    .get(rentza.read)
    .put(rentza.update)
    .delete(rentza.delete);

  // Finish by binding the listing middleware
  app.param('listingId', rentza.listingByID);
};
