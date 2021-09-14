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

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const iotAgent = require('../../lib/iotagentCore');
const _ = require('underscore');
const mappings = require('../../lib/mappings');
const request = require('request');
const mongoUtils = require('../tools/mongoDBUtils');
const utils = require('../tools/utils');
const async = require('async');
const apply = async.apply;
const config = require('../testConfig');
const should = require('should');
const nock = require('nock');

describe('Device and configuration provisioning', function () {
    beforeEach(function (done) {
        iotAgent.start(config, function (error) {
            async.series([apply(mongoUtils.cleanDbs, config.iota.contextBroker.host), mappings.clean], function (
                error
            ) {
                done();
            });
        });
    });

    afterEach(function (done) {
        iotAgent.stop(done);
    });
    describe('When a new Device provisioning arrives to the IoT Agent without internal mapping', function () {
        const provisioningOpts = {
            url: 'http://localhost:' + config.iota.server.port + '/iot/devices',
            method: 'POST',
            json: utils.readExampleFile('./test/examples/deviceProvisioning/deviceProvisioningNoMapping.json'),
            headers: {
                'fiware-service': 'dumbmordor',
                'fiware-servicepath': '/deserts'
            }
        };

        it('should fail with a 400 error', function (done) {
            request(provisioningOpts, function (error, response, body) {
                console.log('BODY: ' + body);
                should.not.exist(error);
                response.statusCode.should.equal(400);
                done();
            });
        });
    });
    describe('When a new Device provisioning arrives to the IoT Agent with a right mapping', function () {
        const provisioningOpts = {
            url: 'http://localhost:' + config.iota.server.port + '/iot/devices',
            method: 'POST',
            json: utils.readExampleFile('./test/examples/deviceProvisioning/deviceProvisioningRightMapping.json'),
            headers: {
                'fiware-service': 'dumbmordor',
                'fiware-servicepath': '/deserts'
            }
        };
        const dataOpts = {
            url: 'http://localhost:' + config.sigfox.port + '/update',
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

        nock('http://' + config.iota.contextBroker.host + ':' + config.iota.contextBroker.port)
            .post('/v2/entities?options=upsert')
            .reply(204);

        nock('http://' + config.iota.contextBroker.host + ':' + config.iota.contextBroker.port)
            .post('/v2/entities?options=upsert')
            .reply(204);

        nock('http://' + config.iota.contextBroker.host + ':' + config.iota.contextBroker.port)
            .patch('/v2/entities/sigApp2/attrs?type=SIGFOX')
            .reply(204);

        nock('http://' + config.iota.contextBroker.host + ':' + config.iota.contextBroker.port)
            .patch('/v2/entities/sigApp3/attrs?type=SIGFOX')
            .reply(204);

        it('should use the provided provisioning', function (done) {
            request(provisioningOpts, function (error, response, body) {
                should.not.exist(error);

                request(dataOpts, function (error, response, body) {
                    should.not.exist(error);
                    response.statusCode.should.equal(200);

                    done();
                });
            });
        });
    });
    describe('When a new Sigfox configuration arrives to the IoT Agent without internal mapping', function () {
        it('should fail with a 400 error');
    });
    describe('When a new Sigfox configuration arrives to the IoT Agent with a right mapping', function () {
        it('should add the new mapping to the mappings module');
    });
});
