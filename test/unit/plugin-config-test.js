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
    utils = require('../tools/utils'),
  iotAgentLib = require('iotagent-node-lib'),
  mongoUtils = require('../tools/mongoDBUtils'),
  async = require('async'),
  apply = async.apply,
  config = require('../testConfig'),
  should = require('should'),
  ngsiClient = ngsiTestUtils.create(
    config.contextBroker.host,
    config.contextBroker.port,
    'dumbMordor',
    '/deserts'
  ),
  sigfoxDevice = {
    id: 'sigApp1',
    type: 'SIGFOX',
    commands: [],
    lazy: [],
    active: [],
    service: 'dumbMordor',
    subservice: '/deserts'
  };

describe('Plugin configuration test', function() {
  beforeEach(function(done) {
    iotAgent.start(config, function() {
      async.series([
        apply(mongoUtils.cleanDbs, config.contextBroker.host),
        mappings.clean
      ], function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    iotAgent.stop(done);
  });

  describe('When an external plugin is configured for the mapping', function() {
    var provisioningOpts = {
        url: 'http://localhost:' + config.server.port + '/iot/devices',
        method: 'POST',
        json: utils.readExampleFile('./test/examples/deviceProvisioning/deviceProvisioningPluginMapping.json'),
        headers: {
          'fiware-service': 'dumbMordor',
          'fiware-servicepath': '/deserts'
        }
      },
      dataOpts = {
        url: 'http://localhost:17428/update',
        method: 'GET',
        qs: {
          id: 'sigApp3',
          time: 1430909015,
          statin: '0A5F',
          lng: -4,
          lat: 41,
          data: '{"campo1": "valor1", "campo2":64}'
        }
      };

    it('should use the plugin to parse the device responses', function(done) {
      request(provisioningOpts, function(error, response, body) {
        should.not.exist(error);

        request(dataOpts, function(error, response, body) {
          should.not.exist(error);
          response.statusCode.should.equal(200);

          ngsiClient.query(
            'sigApp3',
            'SIGFOX',
            [],
            function(error, response, body) {
              var attributes;

              should.not.exist(error);
              should.exist(body);
              should.not.exist(body.errorCode);

              attributes = body.contextResponses[0].contextElement.attributes;

              _.contains(_.pluck(attributes, 'name'), 'campo1').should.equal(true);
              _.contains(_.pluck(attributes, 'name'), 'campo2').should.equal(true);

              done();
            });
        });
      });
    });
  });
});