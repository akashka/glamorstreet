(function(app) {
    'use strict';

    app.registerModule('termsConditions', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('termsConditions.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
