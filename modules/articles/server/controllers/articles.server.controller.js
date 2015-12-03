'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};



var faker = require('faker');

/**
 * fake faker schema db :-)
 */
var fakerSchemas = {};

var generateFakeDataInternal = function(req) {
  var schemaParams = req.body;
  schemaParams.data = [];
  var schema = req.schema;
  
  try {
    schemaParams.items = 0;
    if((schemaParams.limit * schemaParams.page) <= schemaParams.count) {
      schemaParams.items = schemaParams.limit;
    } else {
      if((schemaParams.count - (schemaParams.limit * (schemaParams.page -1))) > 0) {
        schemaParams.items = schemaParams.count - (schemaParams.limit * (schemaParams.page -1));
      }
    }
    for (var i = 0; i < schemaParams.items; i++) {
      var obj = {};
      for(var key in schema) {
        var value = schema[key];

        if(typeof value === 'string') {
          if(value.startsWith('{{') && value.endsWith('}}')) {
            obj[key] = faker.fake(value);
          } else {
            obj[key] = value;
          }
        }


      }
      schemaParams.data.push(obj);
    }
  } catch(error) {
    return 'error while generating data';
  }
  return schemaParams;
};

/**
 * create faker schema
 */
exports.createFakerSchema = function(req, res) {
  
  req.schema = req.body;
  req.body = {};
  req.body.count = 1;
  req.body.page = 1;
  req.body.limit = 1;

  
  var fakerSchemaId = faker.random.uuid();
  fakerSchemas[fakerSchemaId] = req.schema;
  

  res.json(generateFakeDataInternal(req));
};

/**
 * list faker schema
 */
exports.listFakerSchema = function(req, res) {
  if (req.schema) {
    res.json(req.schema);
  } else {
    res.json(fakerSchemas);
  }
};

/**
 * Faker middleware
 */
exports.fakerSchemaById = function(req, res, next, id) {
  var fakerSchema = fakerSchemas[id];
  if (fakerSchema === undefined) {
    res.json({
      'error': 'invalid faker schema id'
    });
  } else {
    req.schema = fakerSchema;
    next();
  }

};

/**
 * return fake data
 */
exports.generateFakeData = function(req, res) {
  var schemaParams = req.body;
  try {
    schemaParams.count = schemaParams.count && (parseInt(schemaParams.count) > 0) ? parseInt(schemaParams.count) : 10;
    schemaParams.page = schemaParams.page && (parseInt(schemaParams.page) > 0) ? parseInt(schemaParams.page) : 1;
    schemaParams.limit = schemaParams.limit && (parseInt(schemaParams.limit) > 0) ? parseInt(schemaParams.limit) : 10;
    if (schemaParams.limit > schemaParams.count) {
      throw 'limit cannot exceed the count';
    }
  } catch (e) {
    res.json({
      'error': e
    });
    return;
  }
  req.body = schemaParams;
  res.json(generateFakeDataInternal(req));
};