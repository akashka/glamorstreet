'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */
var client = 'staydilly';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-ui-select/dist/select.min.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        '/public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-recaptcha/release/angular-recaptcha.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/jquery-migrate/jquery-migrate.min.js',
        'public/lib/ngMeta/dist/ngMeta.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/angular-ui-select/dist/select.min.js',
        'public/lib/angular-toastr/dist/angular-toastr.js',
        'public/lib/angular-wysiwyg/dist/angular-wysiwyg.min.js',
        'public/lib/angular-wysiwyg/demo/scripts/bootstrap-colorpicker-module.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-responsive-images/js/angular-responsive-images.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-device-detector/ng-device-detector.js',
        'public/lib/re-tree/re-tree.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
