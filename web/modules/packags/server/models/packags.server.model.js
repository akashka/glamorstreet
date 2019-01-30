'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PackagSchema = new Schema({


  no_of_days: Number,
  hotel_id: Number,
  rate_plan_id: Number,
  description: String,
  packag_id: Number,
  url_key: String,
  trip_advisor_id: String,
  promo_banner: {
    image: String,
    position: Number,
    html: String
  },
  meta: {
    keywords: String,
    description: String
  }
}, {
  versionKey: false
});

mongoose.model('Packags', PackagSchema);
