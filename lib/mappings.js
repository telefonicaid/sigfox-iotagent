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

const errors = require('./errors');
let mappings = {};
/* eslint-disable no-unused-vars */
const context = {
    op: 'IoTAgentSIGFOX.mappigns'
};

function getMapping(type, callback) {
    if (mappings[type]) {
        callback(null, mappings[type]);
    } else {
        callback(new errors.DataMappingNotFound(type));
    }
}

function addMapping(type, mapping, callback) {
    mappings[type] = mapping;
    callback(null);
}

function clean(callback) {
    mappings = {};
    callback();
}

exports.get = getMapping;
exports.add = addMapping;
exports.clean = clean;
