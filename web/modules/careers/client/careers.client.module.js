(function(app) {
    'use strict';

    app.registerModule('careers', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('careers.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
