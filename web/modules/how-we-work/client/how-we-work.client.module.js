(function(app) {
    'use strict';

    app.registerModule('howWeWork', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes

    app.registerModule('howWeWork.routes', ['ui.router', 'core.routes']);




}(ApplicationConfiguration));
