# FIWARE IoT Agent for SigFox

[![FIWARE IoT Agents](https://nexus.lab.fiware.org/repository/raw/public/badges/chapters/iot-agents.svg)](https://www.fiware.org/developers/catalogue/)
[![](https://nexus.lab.fiware.org/repository/raw/public/badges/stackoverflow/iot-agents.svg)](https://stackoverflow.com/questions/tagged/fiware+iot)

This IoT Agent is designed to be a bridge between the [Sigfox](http://www.sigfox.com/en/) callbacks protocol and the OMA
NGSI protocol used by the [Orion Context Broker](https://github.com/telefonicaid/fiware-orion) as well as by other
components of the FIWARE ecosystem.

For each device, the Sigfox backend can provide a callback mechanism that can be used to send two kinds of information:

-   Attributes defined by the Sigfox backend itself (including id, timestamp, etc.).
-   A free data format, whose structure can be defined in the device type.

The Agent provides the following features:

-   IoT Agent North Bound functionalities, as defined in the
    [IoT Agent Node.js library](https://github.com/telefonicaid/iotagent-node-lib).
-   A Sigfox endpoint listening for callbacks from the sigfox backend. Each piece of information coming from the backend
    is considered as a separate active attribute (as defined in the IoT Agents specification).
-   A Sigfox data parser that can be used to convert from the data format as defined in the callbacks to a JavaScript
    array.
-   A testing tool to simulate the date coming from the device.

The Github's [README.md](https://github.com/telefonicaid/sigfox-iotagent/blob/master/README.md) provides a documentation
summary.
