/*
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of sigfox-iotagent
 *
 * sigfox-iotagent is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * sigfox-iotagent is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with sigfox-iotagent.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[daniel.moranjimenez at telefonica.com]
 */
'use strict';

var iotAgentLib = require('iotagent-node-lib'),
    sigfoxServer = require('./sigfoxServer'),
    async = require('async'),
    apply = async.apply,
    logger = require('logops'),
    context = {
        op: 'IoTAgentSIGFOX.Core'
    };

function updateConfigurationHandler() {
    logger.error('Unsupported configuration update received');
}

function initialize(callback) {
    iotAgentLib.setConfigurationHandler(updateConfigurationHandler);

    logger.info(context, 'Agent started');
    callback();

}

function start(config, callback) {
    logger.setLevel(config.logLevel);

    async.series([
        apply(sigfoxServer.start, config),
        apply(iotAgentLib.activate, config)
    ], function(error, results) {
        if (error) {
            callback(error);
        } else {
            initialize(callback);
        }
    });
}

function stop(callback) {
    logger.info(context, 'Stopping IoT Agent');

    async.series([
        sigfoxServer.stop,
        iotAgentLib.deactivate
    ], callback);
}

exports.start = start;
exports.stop = stop;
