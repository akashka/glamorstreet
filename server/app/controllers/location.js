var Location = require('../models/location');
 
exports.getLocations = function(req, res, next) {
    Location.find(function(err, locations) {
        if (err) { res.send(err); }
        res.json(locations);
    });
}
 
exports.createLocation = function(req, res, next) {
    var location = req.body;
    Location.create(location, function(err, location) {
        if (err) { res.send(err); }
        Location.find(function(err, locations) {
            if (err){ res.send(err); }
            res.json(locations);
        });
    });
}
 
exports.updateLocation = function(req, res, next) {
    var id = req.body._id;
    var location = req.body;
    delete location._id;

    Location.findOneAndUpdate( {_id: id}, location, {upsert: true, new: true}, function(err, location) {
        if (err) return res.send(err);
        res.json(location);
    });
}
