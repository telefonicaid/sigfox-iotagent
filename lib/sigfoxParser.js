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
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::daniel.moranjimenez@telefonica.com
 */
'use strict';

var conversions = {
    uint: 'readUIntBE'
}

function createParser(key) {
    var rawFields = key.replace(/\s+/g, ' ').split(' '),
        fields = rawFields.reduce(function(previousValue, currentValue) {
            var field = currentValue.split('::'),
                size = field[1].split(':');

            previousValue.push({
                name: field[0],
                type: size[0],
                size: size[1]/8
            });

            return previousValue;
        }, []);

    return function parse(data, callback) {
        var buf = new Buffer(data, 'hex'),
            offset = 0,
            fieldIndex = 0,
            data = {};

        while (offset < buf.length) {
            var field = fields[fieldIndex];

            data[field.name] = buf[conversions[field.type]](offset, field.size);

            fieldIndex++;
            offset += field.size;
        }

        callback(null, data);
    };
}

exports.createParser = createParser;
