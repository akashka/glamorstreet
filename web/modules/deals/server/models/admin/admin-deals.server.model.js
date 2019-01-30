'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DealsSchema = new Schema({
  deal_id: Number,
  position: {type: Number, unique: true},
  image: String
}, {
  version: false
});

mongoose.model('Deals', DealsSchema);

