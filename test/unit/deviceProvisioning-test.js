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
    _ = require('underscore'),
    mappings = require('../../lib/mappings'),
    request = require('request'),
    ngsiTestUtils = require('../tools/ngsiUtils'),
    mongoUtils = require('../tools/mongoDBUtils'),
    utils = require('../tools/utils'),
    async = require('async'),
    apply = async.apply,
    config = require('../testConfig'),
    should = require('should'),
    ngsiClient = ngsiTestUtils.create(
        config.contextBroker.host,
        config.contextBroker.port,
        'dumbMordor',
        '/deserts'
    );

describe('Device and configuration provisioning', function() {
    beforeEach(function(done) {
        iotAgent.start(config, function() {
            async.series([
                apply(mongoUtils.cleanDbs, config.contextBroker.host),
                mappings.clean
            ], function(error) {
                done();
            });
        });
    });

    afterEach(function(done) {
        iotAgent.stop(done);
    });
    describe('When a new Device provisioning arrives to the IoT Agent without internal mapping', function() {
        it('should fail with a 400 error');
    });
    describe('When a new Device provisioning arrives to the IoT Agent with a right mapping', function() {
        var provisioningOpts = {
                url: 'http://localhost:' + config.server.port + '/iot/devices',
                method: 'POST',
                json: utils.readExampleFile('./test/examples/deviceProvisioning/deviceProvisioningRightMapping.json'),
                headers: {
                    'fiware-service': 'dumbMordor',
                    'fiware-servicepath': '/deserts'
                }
            },
            dataOpts = {
                url: 'http://localhost:17428/update',
                method: 'GET',
                qs: {
                    id: 'sigApp2',
                    time: 1430909015,
                    statin: '0A5F',
                    lng: -4,
                    lat: 41,
                    data: '000000020000000000230c6f'
                }
            };

        it('should use the provided provisioning', function(done) {
            request(provisioningOpts, function(error, response, body) {
                should.not.exist(error);

                request(dataOpts, function(error, response, body) {
                    should.not.exist(error);
                    response.statusCode.should.equal(200);

                    ngsiClient.query(
                        'sigApp2',
                        'SIGFOX',
                        [],
                        function(error, response, body) {
                            var attributes;

                            should.not.exist(error);
                            should.exist(body);
                            should.not.exist(body.errorCode);

                            attributes = body.contextResponses[0].contextElement.attributes;

                            _.contains(_.pluck(attributes, 'name'), 'theCounter').should.equal(true);
                            _.contains(_.pluck(attributes, 'name'), 'theParam1').should.equal(true);

                            done();
                        });
                });
            });
        });
    });
    describe('When a new Sigfox configuration arrives to the IoT Agent without internal mapping', function() {
        it('should fail with a 400 error');
    });
    describe('When a new Sigfox configuration arrives to the IoT Agent with a right mapping', function() {
        it('should add the new mapping to the mappings module');
    });
});
