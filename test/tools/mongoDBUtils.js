/*
 * Copyright 2014 Telefonica Investigación y Desarrollo, S.A.U
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
 * please contact with::[contacto@tid.es]
 */

const MongoClient = require('mongodb').MongoClient;
const async = require('async');

function cleanDb(host, name, callback) {
    const url = 'mongodb://' + host + ':27017/' + name;

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (db && db.db()) {
            db.db().dropDatabase(function (err, result) {
                db.close();
                callback();
            });
        }
    });
}

function cleanDbs(host, callback) {
    const operations = [
        async.apply(cleanDb, 'localhost', 'iotagent'),
        async.apply(cleanDb, host, 'orion'),
        async.apply(cleanDb, host, 'iotagent')
    ];
    const remoteDatabases = ['smartgondor', 'dumbmordor'];

    for (const i in remoteDatabases) {
        operations.push(async.apply(cleanDb, host, 'orion-' + remoteDatabases[i]));
    }

    async.series(operations, callback);
}

exports.cleanDb = cleanDb;
exports.cleanDbs = cleanDbs;
