(function(app) {
    'use strict';

    app.registerModule('destinations', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('destinations.services');
    app.registerModule('destinations.routes', ['ui.router', 'destinations.routes', 'destinations.services']);
}(ApplicationConfiguration));
