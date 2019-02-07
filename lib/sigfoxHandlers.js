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
    async = require('async'),
    mappings = require('./mappings'),
    apply = async.apply,
    config = require('./configService'),
    errors = require('./errors'),
    sigfoxParser = require('./sigfoxParser'),
    context = {
        op: 'IoTAgentSIGFOX.SigfoxHandlers'
    };

function requiredFields(req, res, next) {
    if (!req.query.id || !req.query.data) {
        config.getLogger().error(context, 'Mandatory fields not found in request');
        next(new errors.MandatoryFieldsNotFound());
    } else {
        next();
    }
}

function generatePayload(queryParams, device, callback) {
    function decode(data, code, callback) {
        sigfoxParser.createParser(code)(data, callback);
    }

    function createPayload(data, callback) {
        var attributes = [];
        for (var i in queryParams) {
            if (queryParams.hasOwnProperty(i) && i !== 'data' && i !== 'id') {
                attributes.push({
                    name: i,
                    type: 'String',
                    value: queryParams[i]
                });
            }
        }
        for (var j in data) {
            if (data.hasOwnProperty(j)) {
                attributes.push({
                    name: j,
                    type: 'Integer',
                    value: data[j]
                });
            }
        }
        iotAgentLib.update(device.name, device.type, '', attributes, device, function(error) {
            if (error) {
                config
                    .getLogger()
                    .error(
                        context,
                        "Couldn't send the updated values to the Context Broker " +
                            'due to an error: %s',
                        error
                    );
            } else {
                config
                    .getLogger()
                    .debug(
                        context,
                        'Single measure for device [%s] successfully updated',
                        device.id
                    );
            }
        });
        callback();
    }

    if (
        device.internalAttributes &&
        device.internalAttributes.length === 1 &&
        device.internalAttributes[0].mapping
    ) {
        async.waterfall(
            [apply(decode, queryParams.data, device.internalAttributes[0].mapping), createPayload],
            callback
        );
    } else if (
        device.internalAttributes &&
        device.internalAttributes.length === 1 &&
        device.internalAttributes[0].plugin
    ) {
        var plugin = require(device.internalAttributes[0].plugin);

        if (plugin && plugin.parse) {
            async.waterfall([apply(plugin.parse, queryParams.data), createPayload], callback);
        } else {
            callback(new errors.ErrorLoadingPlugin(plugin));
        }
    } else {
        async.waterfall(
            [apply(mappings.get, device.type), apply(decode, queryParams.data), createPayload],
            callback
        );
    }
}

function generateLastHandler(res) {
    return function(error, results) {
        if (error) {
            res.status(error.code).json(error);
        } else {
            res.status(200).json({});
        }
    };
}

function handleMeasure(req, res, next) {
    config.getLogger().debug(context, 'Handling request with query [%j]', req.query);

    async.waterfall(
        [
            // Service and subservice should be deduced from Group configuracion
            // Group configuration is based in apikey
            // apply(iotAgentLib.getConfiguration,
            //       config.getConfig().iota.defaultResource || '',
            //       config.getConfig().defaultKey),
            apply(
                iotAgentLib.getDevice,
                req.query.id,
                config.getConfig().iota.service,
                config.getConfig().iota.subservice
            ),
            apply(generatePayload, req.query)
        ],
        generateLastHandler(res)
    );
    return res;
}

/**
 * Load the routes related to device provisioning in the Express App.
 *
 * @param {Object} router      Express request router object.
 */
function loadContextRoutes(router) {
    router.get('/update', requiredFields, handleMeasure);
}

exports.loadContextRoutes = loadContextRoutes;
