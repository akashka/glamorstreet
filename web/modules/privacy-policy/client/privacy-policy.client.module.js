(function(app) {
    'use strict';

    app.registerModule('privacyPolicy', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('privacyPolicy.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
