'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */
var client = 'traveler.mv';

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
    css: [
      'modules/*/client/{css,less,scss}/*.css',
      'views/' + client + '/modules/*/client/{css,less,scss,custom}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js','modules/core/client/app/init.js','modules/about-us/client/about-us.client.module.js','modules/addons/client/addons.client.module.js','modules/articles/client/articles.client.module.js','modules/become-a-partner/client/become-a-partner.client.module.js','modules/booking/client/booking.client.module.js','modules/careers/client/careers.client.module.js','modules/chat/client/chat.client.module.js','modules/cms/client/cms.client.module.js','modules/contact/client/contact.client.module.js','modules/core/client/core.client.module.js','modules/destinations/client/destinations.client.module.js','modules/faq/client/faq.client.module.js','modules/help/client/help.client.module.js','modules/homepage/client/homepage.client.module.js','modules/hotels-resorts/client/hotels-resorts.client.module.js','modules/hotels/client/hotels.client.module.js','modules/how-we-work/client/how-we-work.client.module.js','modules/locations/client/locations.client.module.js','modules/packags/client/packags.client.module.js','modules/partners-portal/client/partners-portal.client.module.js','modules/press-kit/client/press-kit.client.module.js','modules/press-release/client/press-release.client.module.js','modules/privacy-policy/client/privacy-policy.client.module.js','modules/terms-and-conditions/client/terms-and-conditions.client.module.js','modules/users/client/users.client.module.js','modules/about-us/client/config/about-us.client.routes.js','modules/about-us/client/controllers/about-us.client.controller.js','modules/addons/client/config/addons.client.routes.js','modules/addons/client/controllers/addons.client.controller.js','modules/addons/client/controllers/viewAddons.client.controller.js','modules/addons/client/services/addons.client.service.js','modules/articles/client/config/articles-admin.client.config.js','modules/articles/client/config/articles-admin.client.routes.js','modules/articles/client/config/articles.client.menus.js','modules/articles/client/config/articles.client.routes.js','modules/articles/client/controllers/admin/article.client.controller.js','modules/articles/client/controllers/admin/list-articles.client.controller.js','modules/articles/client/controllers/articles.client.controller.js','modules/articles/client/controllers/list-articles.client.controller.js','modules/articles/client/services/articles.client.service.js','modules/become-a-partner/client/config/become-a-partner.client.routes.js','modules/become-a-partner/client/controllers/become-a-partner.client.controller.js','modules/booking/client/config/booking.client.routes.js','modules/booking/client/controllers/booking.client.controller.js', 'modules/booking/client/controllers/packageBooking.client.controller.js','modules/booking/client/controllers/bookingDetails.client.controller.js','modules/booking/client/controllers/bookingerror.client.controller.js','modules/booking/client/controllers/confirm.client.controller.js','modules/booking/client/controllers/manageBooking.client.controller.js','modules/booking/client/services/booking.client.service.js','modules/careers/client/config/careers.client.routes.js','modules/careers/client/controllers/careers.client.controller.js','modules/chat/client/config/chat.client.menus.js','modules/chat/client/config/chat.client.routes.js','modules/chat/client/controllers/chat.client.controller.js','modules/cms/client/config/cms.client.routes.js','modules/cms/client/controllers/blog.client.controller.js','modules/cms/client/controllers/cms.client.controller.js','modules/cms/client/controllers/collections.client.controller.js','modules/cms/client/controllers/currencies.client.controller.js','modules/cms/client/controllers/dashboard.client.controller.js','modules/cms/client/controllers/deals.client.controller.js','modules/cms/client/controllers/destinations.client.controller.js','modules/cms/client/controllers/editor.client.controller.js','modules/cms/client/controllers/hotels.client.controller.js','modules/cms/client/controllers/locations.client.controller.js','modules/cms/client/controllers/maintenance-data.client.controller.js','modules/cms/client/controllers/metatags.client.controller.js','modules/cms/client/controllers/orderDetails-data.client.controller.js','modules/cms/client/controllers/packags.client.controller.js','modules/cms/client/controllers/promotions.client.controller.js','modules/cms/client/controllers/static-page.client.controller.js','modules/cms/client/controllers/users-data.client.controller.js','modules/cms/client/directives/heading/heading.js','modules/cms/client/modals/imageUploadModal/imageUploadModal.js','modules/cms/client/services/cms.client.service.js','modules/contact/client/config/contact.client.routes.js','modules/contact/client/controllers/contact.client.controller.js','modules/contact/client/services/contact.client.service.js','modules/core/client/app/client.js','modules/core/client/config/core-admin.client.menus.js','modules/core/client/config/core-admin.client.routes.js','modules/core/client/config/core.client.menus.js','modules/core/client/config/core.client.route-filter.js','modules/core/client/config/core.client.routes.js','modules/core/client/config/googleAndFacebookLogin.client.service.js','modules/core/client/controllers/error.client.controller.js','modules/core/client/controllers/footer.client.controller.js','modules/core/client/controllers/header.client.controller.js','modules/core/client/controllers/home.client.controller.js','modules/core/client/controllers/Listsearch.client.controller.js','modules/core/client/controllers/maintenanceoff.client.controller.js','modules/core/client/controllers/search.client.controller.js','modules/core/client/controllers/upperFooter.client.controller.js','modules/core/client/directives/auto-focus.client.directive.js','modules/core/client/directives/page-title.client.directive.js','modules/core/client/directives/show-errors.client.directive.js','modules/core/client/filters/changeLetter.client.service.js','modules/core/client/filters/intPriceFormat.js','modules/core/client/filters/trim.js','modules/core/client/js/ng-img-crop.js','modules/core/client/js/ui-bootstrap-tpls.min.js','modules/core/client/services/caluculate.client.service .js','modules/core/client/services/GoogleAdWords.client.service.js','modules/core/client/services/interceptors/auth-interceptor.client.service.js','modules/core/client/services/menu.client.service.js','modules/core/client/services/metaTags.client.service.js','modules/core/client/services/patterns.client.service.js','modules/core/client/services/socket.io.client.service.js','modules/destinations/client/config/destinations.client.routes.js','modules/destinations/client/controllers/destinations.client.controller.js','modules/destinations/client/controllers/viewDestination.client.controller.js','modules/faq/client/config/faq.client.routes.js','modules/faq/client/controllers/faq.client.controller.js','modules/help/client/config/help.client.routes.js','modules/help/client/controllers/help.client.controller.js','modules/homepage/client/config/homepage.client.routes.js','modules/homepage/client/controllers/homepage.client.controller.js','modules/homepage/client/services/homepage.client.service.js','modules/hotels-resorts/client/config/hotels-resorts.client.routes.js','modules/hotels-resorts/client/controllers/hotels-resorts.client.controller.js','modules/hotels/client/config/hotels.client.routes.js','modules/hotels/client/controllers/hotels.client.controller.js','modules/hotels/client/controllers/locationHotels.client.controller.js','modules/hotels/client/controllers/maps.controller.js','modules/hotels/client/controllers/sliderDemoCtrl.js','modules/hotels/client/controllers/viewHotels.client.controller.js','modules/hotels/client/services/hotels.client.service.js','modules/how-we-work/client/config/how-we-work.client.routes.js','modules/how-we-work/client/controllers/how-we-work.client.controller.js','modules/locations/client/config/locations.client.routes.js','modules/locations/client/controllers/locations.client.controller.js','modules/locations/client/controllers/viewLocation.client.controller.js','modules/locations/client/services/locations.client.service.js','modules/packags/client/config/packags.client.routes.js','modules/packags/client/controllers/packags.client.controller.js','modules/packags/client/controllers/viewPackags.client.controller.js','modules/packags/client/services/packags.client.service.js','modules/partners-portal/client/config/partners-portal.client.routes.js','modules/partners-portal/client/controllers/partners-portal.client.controller.js','modules/press-kit/client/config/press-kit.client.routes.js','modules/press-kit/client/controllers/press-kit.client.controller.js','modules/press-release/client/config/press-release.client.routes.js','modules/press-release/client/controllers/press-release.client.controller.js','modules/privacy-policy/client/config/privacy-policy.client.routes.js','modules/privacy-policy/client/controllers/privacy-policy.client.controller.js','modules/terms-and-conditions/client/config/terms-and-conditions.client.routes.js','modules/terms-and-conditions/client/controllers/terms-and-conditions.client.controller.js','modules/users/client/config/users-admin.client.menus.js','modules/users/client/config/users-admin.client.routes.js','modules/users/client/config/users.client.routes.js','modules/users/client/controllers/admin/list-users.client.controller.js','modules/users/client/controllers/admin/profile.client.controller.js','modules/users/client/controllers/admin/refer-friend.client.controller.js','modules/users/client/controllers/admin/user.client.controller.js','modules/users/client/controllers/admin/wallet.client.controller.js','modules/users/client/controllers/authentication.client.controller.js','modules/users/client/controllers/password.client.controller.js','modules/users/client/controllers/settings/change-password.client.controller.js','modules/users/client/controllers/settings/change-profile-picture.client.controller.js','modules/users/client/controllers/settings/edit-profile.client.controller.js','modules/users/client/controllers/settings/manage-social-accounts.client.controller.js','modules/users/client/controllers/settings/settings.client.controller.js','modules/users/client/directives/forgetPassword-popup.client.directive.js','modules/users/client/directives/password-validator.client.directive.js','modules/users/client/directives/password-verify.client.directive.js','modules/users/client/directives/signin-popup.client.directive.js','modules/users/client/directives/signup-popup.client.directive.js','modules/users/client/directives/users.client.directive.js','modules/users/client/modals/Loginmodal.client.controller.js','modules/users/client/services/authentication.client.service.js','modules/users/client/services/password-validator.client.service.js','modules/users/client/services/user-admin.client.services.js','modules/users/client/services/users.client.service.js','views/traveler.mv/modules/cms/client/js/app.min.js','views/traveler.mv/modules/cms/client/js/bootstrap-switch.min.js','views/traveler.mv/modules/cms/client/js/dashboard.js','views/traveler.mv/modules/cms/client/js/demo.min.js','views/traveler.mv/modules/cms/client/js/jquery.blockui.min.js','views/traveler.mv/modules/cms/client/js/jquery.counterup.min.js','views/traveler.mv/modules/cms/client/js/jquery.slimscroll.min.js','views/traveler.mv/modules/cms/client/js/jquery.waypoints.min.js','views/traveler.mv/modules/cms/client/js/js.cookie.min.js','views/traveler.mv/modules/cms/client/js/layout.min.js','views/traveler.mv/modules/cms/client/js/morris.min.js','views/traveler.mv/modules/cms/client/js/ng-img-crop.js','modules/core/client/js/ng-switchery.js','views/traveler.mv/modules/cms/client/js/raphael-min.js','views/traveler.mv/modules/core/client/js/angular-lightbox.js','views/traveler.mv/modules/core/client/js/bootstrap-switch.min.js','views/traveler.mv/modules/core/client/js/bootstrap-timepicker.js','views/traveler.mv/modules/core/client/js/cat_nav_mobile.js','views/traveler.mv/modules/core/client/js/common_scripts_min.js','views/traveler.mv/modules/core/client/js/daterangepicker.js','views/traveler.mv/modules/core/client/js/demo.js','views/traveler.mv/modules/core/client/js/functions.js','views/traveler.mv/modules/core/client/js/greensock.js','views/traveler.mv/modules/core/client/js/html5shiv.min.js','views/traveler.mv/modules/core/client/js/icheck.min.js','views/traveler.mv/modules/core/client/js/infobox.js','views/traveler.mv/modules/core/client/js/jquery-1.11.2.min.js','views/traveler.mv/modules/core/client/js/jquery-ui.min.js','views/traveler.mv/modules/core/client/js/jquery.blockui.min.js','views/traveler.mv/modules/core/client/js/jquery.cookiebar.js','views/traveler.mv/modules/core/client/js/jquery.counterup.min.js','views/traveler.mv/modules/core/client/js/jquery.ddslick.js','views/traveler.mv/modules/core/client/js/jquery.finaltilesgallery.js','views/traveler.mv/modules/core/client/js/jquery.magnific-popup.min.js','views/traveler.mv/modules/core/client/js/jquery.simpleWeather.min.js','views/traveler.mv/modules/core/client/js/jquery.sliderPro.min.js','views/traveler.mv/modules/core/client/js/jquery.slimscroll.min.js','views/traveler.mv/modules/core/client/js/jquery.validate.js','views/traveler.mv/modules/core/client/js/jquery.waypoints.min.js','views/traveler.mv/modules/core/client/js/js.cookie.min.js','views/traveler.mv/modules/core/client/js/layerslider.kreaturamedia.jquery.js','views/traveler.mv/modules/core/client/js/layerslider.transitions.js','views/traveler.mv/modules/core/client/js/layout.min.js','views/traveler.mv/modules/core/client/js/modernizr.js','views/traveler.mv/modules/core/client/js/MOLPay_seamless.deco.js','views/traveler.mv/modules/core/client/js/morphext.min.js','views/traveler.mv/modules/core/client/js/morris.min.js','views/traveler.mv/modules/core/client/js/ng-img-crop.js','views/traveler.mv/modules/core/client/js/owl.carousel.min.js','views/traveler.mv/modules/core/client/js/parallax.min.js','views/traveler.mv/modules/core/client/js/picturefill.min.js','views/traveler.mv/modules/core/client/js/platform.js','views/traveler.mv/modules/core/client/js/pop_up.min.js','views/traveler.mv/modules/core/client/js/raphael-min.js','views/traveler.mv/modules/core/client/js/respond.min.js','views/traveler.mv/modules/core/client/js/retina-replace.min.js','views/traveler.mv/modules/core/client/js/rzslider.min.js','views/traveler.mv/modules/core/client/js/satellizer.js','views/traveler.mv/modules/core/client/js/tabs.js','views/traveler.mv/modules/core/client/js/theia-sticky-sidebar.js','views/traveler.mv/modules/core/client/js/video_header.js','views/traveler.mv/modules/core/client/js/wow.min.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['views/' + client + '/modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};