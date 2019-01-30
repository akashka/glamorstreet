'use strict';

/**
 * Module dependencies
 */
var blogsPolicy = require('../policies/blogs.server.policy'),
  blogs = require('../controllers/blogs.server.controller');

module.exports = function (app) {

  app.route('/api/blogs')
    .get(blogs.getblogs);

  app.route('/api/recBlogs')
    .get(blogs.getRecblogs);

  app.route('/api/blogTag')
    .get(blogs.getblogTag);

  app.route('/api/blogCat')
    .get(blogs.getblogCat);

  app.route('/api/blog')
    .get(blogs.getSinglePost);

  app.route('/api/Catblogs')
    .get(blogs.getCatblogs);

  app.route('/api/Tagblogs')
    .get(blogs.getTagblogs);

};
