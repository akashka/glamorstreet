(function(app) {
    'use strict';

    app.registerModule('help', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('help.routes', ['ui.router', 'core.routes'  ]);

}(ApplicationConfiguration));
