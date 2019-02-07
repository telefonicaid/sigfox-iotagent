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

var iotAgent = require('../../lib/iotagentCore'),
    mappings = require('../../lib/mappings'),
    request = require('request'),
    iotAgentLib = require('iotagent-node-lib'),
    mongoUtils = require('../tools/mongoDBUtils'),
    async = require('async'),
    apply = async.apply,
    config = require('../testConfig'),
    should = require('should'),
    sigfoxDevice = {
        id: 'sigApp1',
        type: 'SIGFOX',
        commands: [],
        lazy: [],
        active: [
            {
                name: 'time',
                type: 'String'
            },
            {
                name: 'statin',
                type: 'String'
            },
            {
                name: 'lng',
                type: 'String'
            },
            {
                name: 'lat',
                type: 'String'
            },
            {
                name: 'counter',
                type: 'Integer'
            },
            {
                name: 'param1',
                type: 'Integer'
            },
            {
                name: 'param2',
                type: 'Integer'
            },
            {
                name: 'tempDegreesCelsius',
                type: 'Integer'
            },
            {
                name: 'voltage',
                type: 'Integer'
            }
        ],
        service: 'dumbMordor',
        subservice: '/deserts'
    };

describe('Context Broker communication', function() {
    beforeEach(function(done) {
        iotAgent.start(config, function() {
            async.series(
                [
                    apply(mongoUtils.cleanDbs, config.iota.contextBroker.host),
                    mappings.clean,
                    apply(
                        mappings.add,
                        'SIGFOX',
                        'counter::uint:32  param1::uint:32 param2::uint:8 tempDegreesCelsius::uint:8  voltage::uint:16'
                    ),
                    apply(iotAgentLib.register, sigfoxDevice)
                ],
                function() {
                    done();
                }
            );
        });
    });

    afterEach(function(done) {
        iotAgent.stop(done);
    });

    describe('When a new sigfox measure arrives to the IoT Agent', function() {
        var options = {
            url: 'http://localhost:17428/update',
            method: 'GET',
            qs: {
                id: 'sigApp1',
                time: 1430909015,
                statin: '0A5F',
                lng: -4,
                lat: 41,
                data: '000000020000000000230c6f'
            }
        };

        it('should answer with a 200 OK', function(done) {
            request(options, function(error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(200);
                done();
            });
        });

        it('should call the Context Broker with the appropriate attributes', function(done) {
            request(options, function(error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(200);
                done();
                // ngsiClient.query(
                //     'sigApp1',
                //     'SIGFOX',
                //     [],
                //     function(error, response, body) {
                //         var attributes;

                //         should.not.exist(error);
                //         should.exist(body);
                //         console.log(body);
                //         should.not.exist(body.errorCode);

                //                     attributes = body.contextResponses[0].contextElement.attributes;

                //                     attributes[0].name.should.equal('counter');
                //                     attributes[0].value.should.equal('2');
                //                     attributes[1].name.should.equal('lat');
                //                     attributes[1].value.should.equal('41');
                //                     attributes[2].name.should.equal('lng');
                //                     attributes[2].value.should.equal('-4');
                //                     attributes[3].name.should.equal('param1');
                //                     attributes[3].value.should.equal('0');
                //                     attributes[4].name.should.equal('param2');
                //                     attributes[4].value.should.equal('0');
                //                     attributes[5].name.should.equal('statin');
                //                     attributes[5].value.should.equal('0A5F');
                //                     attributes[6].name.should.equal('tempDegreesCelsius');
                //                     attributes[6].value.should.equal('35');
                //                     attributes[7].name.should.equal('time');
                //                     attributes[7].value.should.equal('1430909015');
                //                     attributes[8].name.should.equal('voltage');
                //                     attributes[8].value.should.equal('3183');

                //     done();
                // });
            });
        });
    });

    describe('When a new piece of data arrives for a unexistent device', function() {
        var options = {
            url: 'http://localhost:17428/update',
            method: 'GET',
            qs: {
                id: 'unexistentApp',
                time: 1430909015,
                statin: '0A5F',
                lng: -4,
                lat: 41,
                data: '000000020000000000230c6f'
            }
        };

        it('should raise a controlled error', function(done) {
            request(options, function(error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(404);
                done();
            });
        });
    });
});
