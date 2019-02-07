# User & Programmers Manual

### Basic usage

The basic usage of this IoT Agent is the same as any other. In order to have the Device working follow this steps:

-   Start the agent
-   Provision the device in the Agent using the
    [Device Provisioning API](https://github.com/telefonicaid/iotagent-node-lib#-device-provisioning-api)
-   Configure the Sigfox Backend to send a callback to the backend
-   Send data from the device

This basic usage can have a wide range of variations. In the following sections each step will be described in detail.

NOTE: this first version doesn't support Configuration provisioning, so each device must be provisioned individually.

### Starting the agent

In order to start the agent, execute the following command from the root of the project:

```bash
bin/iotagent
```

### Provisioning the device in the Agent

To provision the device, use the API provided in
[Device Provisioning API](https://github.com/telefonicaid/iotagent-node-lib#-device-provisioning-api) with the following
changes:

-   No attributes need to be defined in this version. All the Sigfox parameters and data fields will be mapped to their
    correspondent attributes in the NGSI Request. This behavior will change in the near future to adhere to the common
    IoT Agent provisioning style.
-   A special internal attribute called `mapping` **must** be provided, containing the structure of the `data` attribute
    of the device.

The following code fragment shows the body of a device provisioning for a sigfox device. End-to-end examples of this
provisioning can be found in the `/test` folder.

```json
{
    "name": "sigApp2",
    "service": "dumbMordor",
    "service_path": "/deserts",
    "entity_name": "sigApp2",
    "entity_type": "SIGFOX",
    "timezone": "America/Santiago",
    "attributes": [],
    "lazy": [],
    "static_attributes": [],
    "commands": [],
    "internal_attributes": [
        {
            "mapping": "theCounter::uint:32  theParam1::uint:32 param2::uint:8 tempDegreesCelsius::uint:8  voltage::uint:16"
        }
    ]
}
```

### Provisioning with a custom plugin

If the default mapping mechanism is not powerful enough to fit your needs, custom plugins can be developed for data
parsing. Parse plugins are standard node.js modules, and will be required with a `require()` instruction, so there are
two ways of providing the module:

-   Registering the module in the npm registry and installing it in the IoT Agent.
-   Copying the module file in the IoT Agent folder and referring to the file using a relative path.

In both cases, the plugin must be configured in the device provisioning request, by using the `plugin` internal
attribute. This attribute replace the mandatory `mapping` attribute. In case both exists, the `mapping` attribute takes
precedence.

The module may contain any node.js code, but it **must** export a function called `parse()` with the following
signature:

```javascript
function parse(data, callback);
```

This function will be invoked any time a new piece of data comes to the IoT Agent for a device configured with the
plugin. The `data` parameter, in that case, will contain the measure payload in string format. The `callback()` must be
invoked once the parsing process has finished with one of the following results:

-   If the parse was successful, two parameters **must** be passed to the callback: a first `null` value, indicating
    there was no error; and a single object parameter, having one attribute for each of the values in the payload. Each
    one of this attributes will be mapped to an entity attribute in the Context Entity.
-   If there was any error parsing, a new error object should be created, and passed as the first parameter to the
    callback. This error object should contain, at least, a `name` parameter indicating the error name and a `code`
    parameter suggesting a code to return to the caller.

The following example shows a provisioning of a device with a plugin. This example can be seen working in the tests
section.

```json
{
    "name": "sigApp3",
    "service": "dumbMordor",
    "service_path": "/deserts",
    "entity_name": "sigApp3",
    "entity_type": "SIGFOX",
    "timezone": "America/Santiago",
    "attributes": [],
    "lazy": [],
    "static_attributes": [],
    "commands": [],
    "internal_attributes": [
        {
            "plugin": "../test/examples/plugins/jsonPlugin"
        }
    ]
}
```

### Configuring the Sigfox backend to provide a callback

For a detailed description of the creation device process in the Sigfox backend, please, refer to the Sigfox
documentation.

In order to create the callback URL, use the port value configured in the `config.js` file (in particular
`config.sigfox.port` parameter). The default port in the configuration is the **17428**. The default path for incoming
callbacks is not configurable and is hardwired to `/update`. This version of the Agent only supports 'GET' callbacks.

The device data has no default data mapping - use the same device mapping you introduced in the provisioning step.

### Sending data from the device

To aid in testing purposes, a test client is being developed to simulate device callbacks. In order to launch it, use
the following command from the root folder:

```bash
bin/sigfox-test.js
```

This command launches a test shell with the following commands:

```text
showParameters

    Show the current device parameters that will be sent along with the callback

setParameters <name> <value>

    Set the value for the selected parameter

sendMeasure <data>

    Send a measure to the defined endpoint, with the defined parameters and the data passed to the command
```

The test shell stores a map of the parameters that will be sent as query parameters of the callback. To show the
paramaters, use `showParameters`. In order to change any of them, use the `testParameters` command. This parameters will
be common for all the requests originating from the test tool. In order to send a measure use `sendMeasure`. Take
special care with this command, as it doesn't check whether the format of the data is right or not; in the later case,
an error will be risen in the data parsing in the IoT Agent, leading to unpredictable results. The expected `data`
format is the one defined in the device provisioning.

## <a name="dataformat"/> Data format

Here is an example of the currently supported data formats:

```
counter::uint:32  param1::uint:32 param2::uint:8 tempDegreesCelsius::uint:8  voltage::uint:16
```

The supported format has to adhere to the following rules:

-   The format is composed of **N** fields, sepparated by spaces.
-   Each field is composed of two parts, sepparated by the pattern `::`. The first part will be taken to be the name of
    the attribute, the second one the definition of the value type.
-   The definition of the value type is composed of two parts, sepparated by a colon `:`. The first part indicates the
    type of data (e.g.: integer, float, etc.). The one supported type currently is `uint` (unsigned integer). The second
    part indicates the size in bytes of the data.

Given this rules and the format example given, the following piece of data, `000000020000000000230c6f` would have the
following values (expressed in decimal base):

-   counter: 2
-   param1: 0
-   param2: 0
-   tempDegreesCelsius: 35
-   voltage: 3183

## <a name="development"/> Development documentation

### Project build

The project is managed using npm.

For a list of available task, type

```bash
npm run
```

The following sections show the available options in detail.

### Testing

[Mocha](https://mochajs.org/) Test Runner + [Should.js](https://shouldjs.github.io/) Assertion Library.

The test environment is preconfigured to run BDD testing style.

Module mocking during testing can be done with [proxyquire](https://github.com/thlorenz/proxyquire)

To run tests, type

```bash
npm test
```

### Coding guidelines

jshint

Uses provided .jshintrc flag file. To check source code style, type

```bash
npm run lint
```

### Continuous testing

Support for continuous testing by modifying a src file or a test. For continuous testing, type

```bash
npm run test:watch
```

If you want to continuously check also source code style, use instead:

```bash
npm run watch
```

### Code Coverage

Istanbul

Analizes the code coverage of your tests.

To generate an HTML coverage report under `site/coverage/` and to print out a summary, type

```bash
# Use git-bash on Windows
npm run test:coverage
```

### Clean

Removes `node_modules` and `coverage` folders, and `package-lock.json` file so that a fresh copy of the project is
restored.

```bash
# Use git-bash on Windows
npm run clean
```
