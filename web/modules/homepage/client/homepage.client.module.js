(function(app) {
    'use strict';

    app.registerModule('homepage', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('homepage.services');
    app.registerModule('homepage.routes', ['ui.router', 'core.routes', 'homepage.services']);




}(ApplicationConfiguration));
