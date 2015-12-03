'use strict';

/**
 * Module dependencies.
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  app.route('/api/faker')
  .get(articles.listFakerSchema)
  .post(articles.createFakerSchema);

  app.route('/api/faker/:fakerId')
  .get(articles.listFakerSchema)
  .post(articles.generateFakeData);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
  app.param('fakerId', articles.fakerSchemaById);
};
