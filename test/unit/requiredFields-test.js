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

const sigfoxHandlers = require('../../lib/sigfoxHandlers');
const expect = require('chai').expect;
const http = require('http');
const proxyquire = require('proxyquire');

describe('Checking mandatory query fields', function() {
    describe('When a query without any fields is requested', function() {
        /* Test */
        it('should return a 400 error message with missing id and data fields', function(done) {
            const req = new http.IncomingMessage(undefined);
            const res = new http.ServerResponse(req);
            req.query = {};

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data.code).to.equal(400);

                expect(data.name).to.equal('MANDATORY_FIELDS_NOT_FOUND');

                expect(data.message).to.equal(
                    'Some of the mandatory fields for the request were not found: ["id","data"]'
                );
                done();
            });
        });
    });

    describe('When a query with id is requested', function() {
        /* Test */
        it('should return a 400 error message with missing data field', function(done) {
            const req = new http.IncomingMessage(undefined);
            const res = new http.ServerResponse(req);
            req.query = { id: 'Thing001' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data.code).to.equal(400);

                expect(data.name).to.equal('MANDATORY_FIELDS_NOT_FOUND');

                expect(data.message).to.equal('Some of the mandatory fields for the request were not found: ["data"]');
                done();
            });
        });
    });

    describe('When a query with data is requested', function() {
        /* Test */
        it('should return a 400 error message with missing id field', function(done) {
            const req = new http.IncomingMessage(undefined);
            const res = new http.ServerResponse(req);
            req.query = { data: '000000020000000000230c6f' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data.code).to.equal(400);

                expect(data.name).to.equal('MANDATORY_FIELDS_NOT_FOUND');

                expect(data.message).to.equal('Some of the mandatory fields for the request were not found: ["id"]');
                done();
            });
        });
    });

    describe('When a query with id and data fields is requested', function() {
        /* Test */
        it('should return a 400 error message with missing id and data fields', function(done) {
            const req = new http.IncomingMessage(undefined);
            const res = new http.ServerResponse(req);
            req.query = { id: 'Thing001', data: '000000020000000000230c6f' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data).to.equal(undefined);
                done();
            });
        });
    });

    describe('When a query with any fake field except id or data is requested', function() {
        /* Test */
        it('should return a 400 error message with missing id and data fields', function(done) {
            const req = new http.IncomingMessage(undefined);
            const res = new http.ServerResponse(req);
            req.query = { fake: 'foo' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data.code).to.equal(400);

                expect(data.name).to.equal('MANDATORY_FIELDS_NOT_FOUND');

                expect(data.message).to.equal(
                    'Some of the mandatory fields for the request were not found: ["id","data"]'
                );
                done();
            });
        });
    });

    describe('When a iotagent is deployed with an id field name equal to device', function() {
        var configStub = {};
        configStub.getConfig = function() {
            return { idFieldName: 'device' };
        };
        var sigfoxHandlers = proxyquire('../../lib/sigfoxHandlers', { './configService': configStub });

        it('should validate required fields with device in the query', function(done) {
            const req = new http.IncomingMessage(undefined),
                res = new http.ServerResponse(req);
            req.query = { device: 'device', data: '000000020000000000230c6f' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data).to.equal(undefined);
                done();
            });
        });

        it('should reject required fields without device in the query', function(done) {
            const req = new http.IncomingMessage(undefined),
                res = new http.ServerResponse(req);
            req.query = { id: 'device', data: '000000020000000000230c6f' };

            sigfoxHandlers.requiredFields(req, res, function(data) {
                expect(data.code).to.equal(400);

                expect(data.name).to.equal('MANDATORY_FIELDS_NOT_FOUND');

                expect(data.message).to.equal(
                    'Some of the mandatory fields for the request were not found: ["device"]'
                );
                done();
            });
        });
    });
});
