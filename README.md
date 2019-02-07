# FIWARE IoT Agent for Sigfox

[![FIWARE IoT Agents](https://nexus.lab.fiware.org/static/badges/chapters/iot-agents.svg)](https://www.fiware.org/developers/catalogue/)
[![License: APGL](https://img.shields.io/github/license/telefonicaid/iotagent-json.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Docker badge](https://img.shields.io/docker/pulls/fiware/sigfox-iotagent.svg)](https://hub.docker.com/r/fiware/sigfox-iotagent/)
[![Support badge](https://nexus.lab.fiware.org/repository/raw/public/badges/stackoverflow/iot-agents.svg)](https://stackoverflow.com/questions/tagged/fiware+iot)
<br/>
[![Build badge](https://img.shields.io/travis/telefonicaid/sigfox-iotagent.svg)](https://travis-ci.org/telefonicaid/sigfox-iotagent/)
[![Coverage Status](https://coveralls.io/repos/github/telefonicaid/sigfox-iotagent/badge.svg?branch=master)](https://coveralls.io/github/telefonicaid/sigfox-iotagent?branch=master)
![Status](https://nexus.lab.fiware.org/repository/raw/public/badges/statuses/incubating.svg)

An Internet of Things Agent for the [Sigfox](http://www.sigfox.com/en/) callbacks protocol and the
[NGSI](https://swagger.lab.fiware.org/?url=https://raw.githubusercontent.com/Fiware/specifications/master/OpenAPI/ngsiv2/ngsiv2-openapi.json)
interface of a context broker.

It is based on the [IoT Agent Node.js Library](https://github.com/telefonicaid/iotagent-node-lib). Further general
information about the FIWARE IoT Agents framework, its architecture and the common interaction model can be found in the
library's GitHub repository.

This project is part of [FIWARE](https://www.fiware.org/). For more information check the FIWARE Catalogue entry for the
[IoT Agents](https://github.com/Fiware/catalogue/tree/master/iot-agents).

| :whale: [Docker Hub](https://hub.docker.com/r/fiware/sigfox-iotagent) | :dart: [Roadmap](https://github.com/telefonicaid/sigfox-iotagent/blob/master/doc/roadmap.md) |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |


## Contents

-   [Background](#background)
-   [Install](#install)
-   [Usage](#usage)
-   [API](#api)
-   [Testing](#testing)
-   [License](#license)

## Background

This IoT Agent is designed to be a bridge between the [Sigfox](http://www.sigfox.com/en/) callbacks protocol and the OMA
NGSI protocol used by the [Orion Context Broker](https://github.com/telefonicaid/fiware-orion) as well as by other
components of the FIWARE ecosystem.

For each device, the Sigfox backend can provide a callback mechanism that can be used to send two kinds of information:

-   Attributes defined by the Sigfox backend itself (including id, timestamp, etc.).
-   A free data format, whose structure can be defined in the device type.

The Agent provides the following features:

-   IoT Agent North Bound functionalities, as defined in the
    [IoT Agent Node.js library](https://github.com/telefonicaid/iotagent-node-lib).
-   A Sigfox endpoint listening for callbacks from the sigfox backend. Each piece of coming from the backend is
    considered as a sepparate active attribute (as defined in the IoT Agents specification).
-   A Sigfox data parser that can be used to convert from the data format as defined in the callbacks to a Javascript
    array.
-   A testing tool to simulate the date coming from the device.

Most of this functionality is just a prototype to this date, so use this software carefully.

As is the case in any IoT Agent, this one follows the interaction model defined in the
[Node.js IoT Agent Library](https://github.com/telefonicaid/iotagent-node-lib), that is used for the implementation of
the Northbound APIs. Information about the IoTAgent's architecture can be found on that global repository. This
documentation will only address those features and characteristics that are particular to the Sigfox IoTAgent.

## Install

Information about how to install the Sigfox IoT Agent can be found at the corresponding section of the
[Installation & Administration Guide](docs/installationguide.md).

A `Dockerfile` is also available for your use - further information can be found [here](docker/README.md)

## Usage

Information about how to use the IoT Agent can be found in the [User & Programmers Manual](docs/usermanual.md).

## API

Apiary reference for the Configuration API can be found
[here](http://docs.telefonicaiotiotagents.apiary.io/#reference/configuration-api) More information about IoT Agents and
their APIs can be found in the IoT Agent Library [documentation](https://iotagent-node-lib.rtfd.io/).

## Testing

[Mocha](https://mochajs.org/) Test Runner + [Should.js](https://shouldjs.github.io/) Assertion Library.

The test environment is preconfigured to run BDD testing style.

Module mocking during testing can be done with [proxyquire](https://github.com/thlorenz/proxyquire)

To run tests, type

```console
npm test
```

---

## License

The IoT Agent for Sigfox is licensed under Affero General Public License (GPL) version 3.

© 2019 Telefonica Investigación y Desarrollo, S.A.U
