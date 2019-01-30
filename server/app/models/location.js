var mongoose = require('mongoose');
 
var LocationSchema = new mongoose.Schema({

    location_name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
    }

}, {
    timestamps: true
});
 
module.exports = mongoose.model('Location', LocationSchema);
