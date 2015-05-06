#!/usr/bin/env node

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

var clUtils = require('command-node'),
    request = require('request'),
    parameters = {
        id: '8405',
        time: '1430908992',
        statin: '0817',
        lng: -4,
        lat: 41
    };

function showParameters() {
    console.log('\nCurrent measure parameters:\n\n');
    console.log('-------------------------------------------------------')
    console.log(JSON.stringify(parameters, null, 4));
    console.log('\n');
    clUtils.prompt();
}

function sendMeasure(commands) {
    console.log('Sending measure');
    clUtils.prompt();
}

function setParameters(commands) {
    console.log('\nValue for parameter [%s] set to [%s]', commands[0], commands[1]);
    parameters[commands[0]] = commands[1];
    clUtils.prompt();
}

var commands = {
    'showParameters': {
        parameters: [],
        description: '\tShow the current device parameters that will be sent along with the callback',
        handler: showParameters
    },
    'setParameters': {
        parameters: ['name', 'value'],
        description: '\tSet the value for the selected parameter',
        handler: setParameters
    },
    'sendMeasure': {
        parameters: ['data'],
        description: '\tSend a measure to the defined endpoint, with the defined parameters and the data passed to ' +
            'the command',
        handler: sendMeasure
    }
};

clUtils.initialize(commands, 'SIGFOX Test> ');

