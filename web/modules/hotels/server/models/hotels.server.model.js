'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var HotelSchema = new Schema({
  hotel_id: Number,
  url_key: String,
  nearby_hotels: Array,
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

mongoose.model('Hotels', HotelSchema);
