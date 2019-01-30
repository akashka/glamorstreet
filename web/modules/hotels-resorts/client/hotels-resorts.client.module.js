(function(app) {
    'use strict';

    app.registerModule('hotelsResorts', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('hotelsResorts.routes', ['ui.router', 'core.routes'  ]);




}(ApplicationConfiguration));
