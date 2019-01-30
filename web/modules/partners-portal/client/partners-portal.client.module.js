(function(app) {
    'use strict';

    app.registerModule('partnerPortal', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('partnerPortal.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
