(function(app) {
    'use strict';

    app.registerModule('contact', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('contact.services');
    app.registerModule('contact.routes', ['ui.router', 'core.routes', 'contact.services']);




}(ApplicationConfiguration));