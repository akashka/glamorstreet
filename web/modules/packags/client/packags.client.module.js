(function(app) {
    'use strict';

    app.registerModule('packags', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('packags.services');
    app.registerModule('packags.routes', ['ui.router', 'packags.routes', 'packags.services']);
}(ApplicationConfiguration));
