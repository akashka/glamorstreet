var AuthenticationController = require('./controllers/authentication'),
    LocationController = require('./controllers/location'),  
 // Link all controllers  
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 
module.exports = function(app){

    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept");
      res.header("Access-Control-Allow-Methods", "GET, POST","PUT","DELETE","HEAD","OPTIONS");
      next();
    });
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        locationRoutes = express.Router();
       // All routes

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/update', AuthenticationController.update);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.post('/forgotPassword', AuthenticationController.forgotPassword);
    authRoutes.get('/', AuthenticationController.getUsers);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Location Routes
    apiRoutes.use('/locations', locationRoutes); 
    locationRoutes.get('/', LocationController.getLocations);
    locationRoutes.post('/', LocationController.createLocation);
    locationRoutes.put('/:_id', LocationController.updateLocation);
 
    // Set up routes
    app.use('/api', apiRoutes);
 
}
