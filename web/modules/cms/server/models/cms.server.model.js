'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PromotionSchema = new Schema({
    hotel_id: Number,
    be_id: Number,
    image: String,
    html: String,
    button_text: String
});

var DealSchema = new Schema({
    property_id: Number,
    property_name: String,
    be_id: Number,
    position: Number,
    image: String
}, {
    version: false
});

var BlogSchema = new Schema({
    blog_id: Number,
    be_id: Number,
    position: {type: Number, unique: true}
}, {
    version: false
});

var CollectionSchema = new Schema({
    collection_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    image: String,
    description: String
}, {
    version: false
});

var PromosSchema = new Schema({
    promo_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    default: String,
    large: String,
    medium: String,
    small: String,
    portrait: String
});

var LocationSchema = new Schema({
    location_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    image: String
}, {
    version: false
});

var PackagSchema = new Schema({
    packag_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    image: String
}, {
    version: false
});

var TypeSchema = new Schema({
    type_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    image: String,
    header: String,
    description: String
});

var CitySchema = new Schema({
    city_id: Number,
    be_id: Number,
    position: {type: Number, unique: true},
    image: String
    //logo: Stringcolle
});

var StaticPagesSchema = new Schema({
    be_id: Number,
    screen: String,
    description: String,
    image: String,
    displayimage: Boolean,
    image_heading: String
});

var CurrencySchema = new Schema({
    currency_id: Number,
    be_id: Number,
    code: String,
    name: String,
    shiftDecimal: Number,
    values: [{
        from_code: String,
        multiplier: Number
    }]
});

var DestinationSchema = new Schema({
    destination_id: Number,
    be_id: Number,
    city_id: Number,
    city: String,
    state: String,
    state_id: Number,
    address: String,
    images: [String],
    description: String,
    map: String,
    latitude: String,
    longitude: String,
    distance_from: {
        car: String,
        ferry: String,
        speed_boat: String,
        sea_plane: String,
        aeroplane: String
    }
});

var OrderDetailSchema = new Schema({
    status: String,
    searchId: String,
    source: String,
    be_id: Number,
    refrenceId: String,
    hotelId: Number,
    hotelName: String,
    hoteladdress: String,
    image_URL: String,
    hotelContactNo: String,
    specialRequest: String,
    firstName: String,
    lastName: String,
    address: String,
    emailId: String,
    mobileNo: String,
    checkOutDate: String,
    checkInDate: String,
    totalPax: Number,
    noOfRooms: Number,
    roomType: String,
    currency: Number,
    conversionRate: String,
    totalAmount: String,
    subTotal: String,
    serviceTax: String,
    discounts: String,
    promocode: String,
    ipAddress: String,
    browser: String,
    operatingSystem: String,
    device: String,
    ipDetails: String,
    bookingDateTime: String
});

var MetatagSchema = new Schema({
    metatag_id: Number,
    be_id: Number,
    screen: String,
    url: String,
    imageUrl: String,
    keywords: String,
    title: String,
    description: String
});

var HeadingSchema = new Schema({
    be_id: Number,
    title: String,
    description: String,
    type: String
});

var MaintenanceSchema = new Schema({
    be_id: Number,
    display_maintenance: Boolean
});

var SearchLogger = new Schema({
  be_id: Number,
  searchId: String,
  hotel_numbers: Number,
  searchDateTime: String,
  adults: String,
  checkin: String,
  checkout: String,
  country: String,
  deal: String,
  location: String,
  promo: String,
  propertyType: String,
  rooms: String,
  stateId: String
});

var NewsletterSchema = new Schema({
    be_id: Number,
    emailId: {type: String, unique: true},
    signup_date: {type: Date, default: Date.now}
});

var FavouriteHotelsSchema = new Schema({
    be_id: Number,
    user_id: {type: Number, unique: true},
    hotel_id: [Number]
});

mongoose.model('Collection', CollectionSchema);
mongoose.model('Deal', DealSchema);
mongoose.model('Heading', HeadingSchema);
mongoose.model('Location', LocationSchema);
mongoose.model('Packag', PackagSchema);
mongoose.model('Blog', BlogSchema);
mongoose.model('StaticPages', StaticPagesSchema);
mongoose.model('Currency', CurrencySchema);
mongoose.model('Promo', PromosSchema);
mongoose.model('Destination', DestinationSchema);
mongoose.model('Metatag', MetatagSchema);
mongoose.model('OrderDetail', OrderDetailSchema);
mongoose.model('Maintenance', MaintenanceSchema);
mongoose.model('SearchLogger', SearchLogger);
mongoose.model('Newsletter', NewsletterSchema);
mongoose.model('FavouriteHotels', FavouriteHotelsSchema);
