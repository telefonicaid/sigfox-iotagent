/*
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-iotagent-lib
 *
 * fiware-iotagent-lib is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * fiware-iotagent-lib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with fiware-iotagent-lib.
 * If not, see http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::daniel.moranjimenez@telefonica.com
 */
'use strict';

var http = require('http'),
    express = require('express'),
    sigfoxHandlers = require('./sigfoxHandlers'),
    logger = require('logops'),
    context = {
        op: 'IoTAgentSIGFOX.SigfoxServer'
    },
    iotServer;

function handleError(error, req, res, next) {
    var code = 500;

    logger.debug(context, 'Error [%s] handing request: %s', error.name, error.message);

    if (error.code) {
        code = error.code;
    }
    res.status(code).json({
        name: error.name,
        message: error.message
    });
}

function traceRequest(req, res, next) {
    logger.debug(context, 'Request for path [%s] from [%s]', req.path, req.get('host'));

    if (req.headers['content-type'] === 'application/json') {
        logger.debug(context, 'Body:\n\n%s\n\n', JSON.stringify(req.body, null, 4));
    } else if (req.headers['content-type'] === 'application/xml') {
        logger.debug(context, 'Body:\n\n%s\n\n', req.rawBody);
    } else {
        logger.debug(context, 'Unrecognized body type', req.headers['content-type']);
    }

    next();
}

function start(config, callback) {
    var baseRoot = '/',
        agentName = 'default';

    if (config.logLevel) {
        logger.setLevel(config.logLevel);
    }

    iotServer = {
        server: null,
        app: express(),
        router: express.Router()
    };

    logger.info(context, 'Starting IoT Agent listening on port [%s]', config.server.port);
    logger.debug(context, 'Using config:\n\n%s\n', JSON.stringify(config, null, 4));

    iotServer.app.set('port', config.server.port);
    iotServer.app.set('host', '0.0.0.0');

    if (config.server.baseRoot) {
        baseRoot = config.server.baseRoot;
    }

    if (config.server.name) {
        agentName = config.server.name;
    }

    if (config.logLevel && config.logLevel === 'DEBUG') {
        iotServer.app.use(traceRequest);
    }

    iotServer.app.use(baseRoot, iotServer.router);
    sigfoxHandlers.loadContextRoutes(iotServer.router);

    iotServer.app.use(handleError);

    iotServer.server = http.createServer(iotServer.app);

    iotServer.server.listen(iotServer.app.get('port'), iotServer.app.get('host'), callback);
}

function stop(callback) {
    logger.info(context, 'Stopping IoT Agent');

    iotServer.server.close(callback);
}

exports.start = start;
exports.stop = stop;
