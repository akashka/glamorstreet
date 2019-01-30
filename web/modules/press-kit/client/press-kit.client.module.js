(function(app) {
    'use strict';

    app.registerModule('pressKit', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('pressKit.routes', ['ui.router', 'core.routes'  ]);

}(ApplicationConfiguration));
