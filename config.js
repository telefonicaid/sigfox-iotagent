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

var config = {};

/**
 * Configuration for Sigfox
 */
config.sigfox = {
    /**
     * Port for Sigfox server
     */
    port: 17428
};

config.iota = {
    /**
     * Configures the log level. Appropriate values are: FATAL, ERROR, INFO, WARN and DEBUG.
     */
    logLevel: 'DEBUG',

    /**
     * When this flag is active, the IoTAgent will add the TimeInstant attribute to every entity created, as well
     * as a TimeInstant metadata to each attribute, with the current timestamp.
     */
    timestamp: true,

    /**
     * Context Broker configuration. Defines the connection information to the instance of the Context Broker where
     * the IoT Agent will send the device data.
     */
    contextBroker: {
        /**
         * Host where the Context Broker is located.
         */
        host: 'localhost',

        /**
         * Port where the Context Broker is listening.
         */
        port: '1026'
    },

    /**
     * Configuration of the Northbound server of the IoT Agent.
     */
    server: {
        /**
         * Port where the IoT Agent will be listening for requests.
         */
        port: 4041
    },

    /**
     * Configuration for secured access to instances of the Context Broker secured with a PEP Proxy.
     * For the authentication mechanism to work, the authentication attribute in the configuration has to be fully
     * configured, and the authentication.enabled subattribute should have the value `true`.
     *
     * The Username and password should be considered as sensitive data and should not be stored in plaintext.
     * Either encrypt the config and decrypt when initializing the instance or use environment variables secured by
     * docker secrets.
     */
    //authentication: {
    //enabled: false,
    /**
     * Type of the Identity Manager which is used when authenticating the IoT Agent.
     * Either 'oauth2' or 'keystone'
     */
    //type: 'keystone',
    /**
     * Name of the additional header passed to retrieve the identity of the IoT Agent
     */
    //header: 'Authorization',
    /**
     * Hostname of the Identity Manager.
     */
    //host: 'localhost',
    /**
     * Port of the Identity Manager.
     */
    //port: '5000',
    /**
     * URL of the Identity Manager - a combination of the above
     */
    //url: 'localhost:5000',
    /**
     * KEYSTONE ONLY: Username for the IoT Agent
     *  - Note this should not be stored in plaintext.
     */
    //user: 'IOTA_AUTH_USER',
    /**
     * KEYSTONE ONLY: Password for the IoT Agent
     *    - Note this should not be stored in plaintext.
     */
    //password: 'IOTA_AUTH_PASSWORD',
    /**
     * OAUTH2 ONLY: URL path for retrieving the token
     */
    //tokenPath: '/oauth2/token',
    /**
     * OAUTH2 ONLY: Flag to indicate whether or not the token needs to be periodically refreshed.
     */
    //permanentToken: true,
    /**
     * OAUTH2 ONLY: ClientId for the IoT Agent
     *    - Note this should not be stored in plaintext.
     */
    //clientId: 'IOTA_AUTH_CLIENT_ID',
    /**
     * OAUTH2 ONLY: ClientSecret for the IoT Agent
     *    - Note this should not be stored in plaintext.
     */
    //clientSecret: 'IOTA_AUTH_CLIENT_SECRET'
    //},

    /**
     * Configuration for the IoT Manager. If the IoT Agent is part of a configuration composed of multiple IoTAgents
     * coordinated by an IoT Manager, this section defines the information that will be used to connect with that
     * manager.
     */
    //iotManager: {
    /**
     * Host where the IoT Manager is located.
     */
    //   host: 'localhost',

    /**
     * Port where the IoT Manager is listening.
     */
    //   port: 18082,

    /**
     * Path where the IoT Manager accepts subscriptions.
     */
    //   path: '/iot/protocols',

    /**
     * Protocol code identifying this IoT Agent.
     */
    //   protocol: 'IoTA-Sigfox',

    /**
     * Textual description of this IoT Agent.
     */
    //   description: 'Sigfox_IoT_Agent_Node'
    //},

    /**
     * Default resource of the IoT Agent. This value must be different for every IoT Agent connecting to the IoT
     * Manager.
     */
    defaultResource: '/iot/sigfox',

    /**
     * Defines the configuration for the Device Registry, where all the information about devices and configuration
     * groups will be stored. There are currently just two types of registries allowed:
     *
     * - 'memory': transient memory-based repository for testing purposes. All the information in the repository is
     *             wiped out when the process is restarted.
     *
     * - 'mongodb': persistent MongoDB storage repository. All the details for the MongoDB configuration will be read
     *             from the 'mongoDb' configuration property.
     */
    deviceRegistry: {
        type: 'mongodb'
    },

    /**
     * Mongo DB configuration section. This section will only be used if the deviceRegistry property has the type
     * 'mongodb'.
     */
    mongodb: {
        /**
         * Host where MongoDB is located. If the MongoDB used is a replicaSet, this property will contain a
         * comma-separated list of the instance names or IPs.
         */
        host: 'localhost',

        /**
         * Port where MongoDB is listening. In the case of a replicaSet, all the instances are supposed to be listening
         * in the same port.
         */
        port: '27017',

        /**
         * Name of the Mongo database that will be created to store IOTAgent data.
         */
        db: 'iotasigfox'

        /**
         * Name of the set in case the Mongo database is configured as a Replica Set. Optional otherwise.
         */
        //replicaSet: ''
    },

    /**
     *  Types array for static configuration of services. Check documentation in the IoTAgent Library for Node.js for
     *  further details:
     *
     *      https://github.com/telefonicaid/iotagent-node-lib#type-configuration
     */
    types: {},

    /**
     * Default service, for IOTA installations that won't require preregistration.
     */
    service: 'howtoService',

    /**
     * Default subservice, for IOTA installations that won't require preregistration.
     */
    subservice: '/howto',

    /**
     * URL Where the IOTA Will listen for incoming updateContext and queryContext requests (for commands and passive
     * attributes). This URL will be sent in the Context Registration requests.
     */
    providerUrl: 'http://192.168.0.1:4041',

    /**
     * Default maximum expire date for device registrations.
     */
    deviceRegistrationDuration: 'P1Y',

    /**
     * Default type, for IOTA installations that won't require preregistration.
     */
    defaultType: 'Thing'
};

/**
 * Default API Key, to use with device that have been provisioned without a Configuration Group.
 */
config.defaultKey = 'TEF';

/**
 * flag indicating whether the node server will be executed in multi-core option (true) or it will be a
 * single-thread one (false).
 */
//config.multiCore = false;

module.exports = config;
