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

const iotAgentLib = require('iotagent-node-lib');
const http = require('http');
const express = require('express');
const sigfoxHandlers = require('./sigfoxHandlers');
const config = require('./configService');
const context = {
    op: 'IoTAgentSIGFOX.SigfoxServer'
};
let iotServer;

/* eslint-disable no-unused-vars */
function handleError(error, req, res, next) {
    let code = 500;

    config.getLogger().debug(context, 'Error [%s] handling request: %s', error.name, error.message);

    if (error.code) {
        code = error.code;
    }
    res.status(code).json({
        name: error.name,
        message: error.message
    });
}

function traceRequest(req, res, next) {
    config.getLogger().debug(context, 'Request for path [%s] from [%s]', req.path, req.get('host'));

    if (req.headers['content-type'] === 'application/json') {
        config.getLogger().debug(context, 'Body:\n\n%s\n\n', JSON.stringify(req.body, null, 4));
    } else if (req.headers['content-type'] === 'application/xml') {
        config.getLogger().debug(context, 'Body:\n\n%s\n\n', req.rawBody);
    } else {
        config.getLogger().debug(context, 'Unrecognized body type', req.headers['content-type']);
    }

    next();
}

function start(newConfig, callback) {
    let baseRoot = '/';
    //    let agentName = 'default';

    config.setLogger(iotAgentLib.logModule);
    config.setConfig(newConfig);

    iotServer = {
        server: null,
        app: express(),
        router: express.Router()
    };

    config.getLogger().info(context, 'Starting Sigfox server listening on port [%s]', config.getConfig().sigfox.port);
    config.getLogger().debug(context, 'Using config:\n\n%s\n', JSON.stringify(config.getConfig(), null, 4));

    iotServer.app.set('port', config.getConfig().sigfox.port);
    iotServer.app.set('host', '0.0.0.0');

    if (config.getConfig().iota.server.baseRoot) {
        baseRoot = config.getConfig().iota.server.baseRoot;
    }

    //if (config.getConfig().iota.server.name) {
    //    agentName = config.getConfig().iota.server.name;
    //}

    if (config.getConfig().iota.logLevel && config.getConfig().iota.logLevel === 'DEBUG') {
        iotServer.app.use(traceRequest);
    }

    iotServer.app.use(baseRoot, iotServer.router);
    sigfoxHandlers.loadContextRoutes(iotServer.router);

    iotServer.app.use(handleError);

    iotServer.server = http.createServer(iotServer.app);

    iotServer.server.listen(iotServer.app.get('port'), iotServer.app.get('host'), callback);
}

function stop(callback) {
    config.getLogger().info(context, 'Stopping Sigfox server');

    iotServer.server.close(callback);
}

exports.start = start;
exports.stop = stop;
