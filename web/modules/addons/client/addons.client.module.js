(function(app) {
    'use strict';

    app.registerModule('addons', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('addons.services');
    app.registerModule('addons.routes', ['ui.router', 'addons.routes', 'addons.services']);
}(ApplicationConfiguration));
