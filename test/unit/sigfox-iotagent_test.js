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

var sigfoxParser = require('../../lib/sigfoxParser'),
    should = require('should'),
    key = 'counter::uint:32  param1::uint:32 param2::uint:8 tempDegreesCelsius::uint:8  voltage::uint:16';

describe('Parsing modules', function() {
    describe('A data payload "000000020000000000230c6f" is parsed with the given key', function() {
        it('should extract all its values', function(done) {
            sigfoxParser.createParser(key)('000000020000000000230c6f', function(error, data) {
                should.not.exist(error);
                should.exist(data);
                data.counter.should.equal(2);
                data.param1.should.equal(0);
                data.param2.should.equal(0);
                data.tempDegreesCelsius.should.equal(35);
                data.voltage.should.equal(3183);
                done();
            });
        });
    });
});
