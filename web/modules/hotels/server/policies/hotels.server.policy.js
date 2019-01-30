'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {

};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    return true;
};
