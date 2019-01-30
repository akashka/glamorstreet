(function(app) {
    'use strict';

    app.registerModule('becomePartner', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('becomePartner.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
