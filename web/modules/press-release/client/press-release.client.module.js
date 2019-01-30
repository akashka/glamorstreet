(function(app) {
    'use strict';

    app.registerModule('pressRelease', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('pressRelease.routes', ['ui.router', 'core.routes'  ]);

}(ApplicationConfiguration));
