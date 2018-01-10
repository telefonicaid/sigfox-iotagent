# sigfox-iotagent

* [Overview](#overview)
* [Installation](#installation)
* [Usage](#usage)
* [Data Format](#dataformat)
* [Development Documentation](#development)

## <a name="overview"/> Overview
This IoT Agent is designed to be a bridge between the [Sigfox](http://www.sigfox.com/en/) callbacks protocol and the OMA NGSI protocol used by the [Orion Context Broker](https://github.com/telefonicaid/fiware-orion) as well as by other components of the FIWARE ecosystem.

For each device, the Sigfox backend can provide a callback mechanism that can be used to send two kinds of information:
* Attributes defined by the Sigfox backend itself (including id, timestamp, etc.).
* A free data format, whose structure can be defined in the device type.

The Agent provides the following features:
* IoT Agent North Bound functionalities, as defined in the [IoT Agent Node.js library](https://github.com/telefonicaid/iotagent-node-lib).
* A Sigfox endpoint listening for callbacks from the sigfox backend. Each piece of coming from the backend is considered as a sepparate active attribute (as defined in the IoT Agents specification).
* A Sigfox data parser that can be used to convert from the data format as defined in the callbacks to a Javascript array.
* A testing tool to simulate the date coming from the device.

Most of this functionality is just a prototype to this date, so use this software carefully.

## <a name="installation"/> Installation
### Using Github
In order to use the IoT Agent, you can just clone the Github repository and use the default configuration. You can use the
following command:
```
git clone https://github.com/telefonicaid/sigfox-iotagent.git
```

### Using Docker

If you are using Docker, you can download the latest Sigfox IoTAgent module from Docker Hub, in order to try it. 
Do not use this installation mode for production purposes.

The Docker module has the prerequisite of having a Orion Context Broker that must be linked on start 
for the module to work. There is currently just one simple configuration offered for the IOTA, with in-memory transient 
storage (in the future, more configurations will be available).

If there is a docker container running with the Context Broker and name orion, the following command will start a 
Thinking Things IoT Agent:
```
docker run -t -i --link orion:orion -p 4041:4041 -p 17428:17428 fiware/sigfox-iotagent
```

## <a name="usage"/>  Usage
### Basic usage
The basic usage of this IoT Agent is the same as any other. In order to have the Device working follow this steps:
* Start the agent
* Provision the device in the Agent using the [Device Provisioning API](https://github.com/telefonicaid/iotagent-node-lib#-device-provisioning-api)
* Configure de Sigfox Backend to send a callback to the backend
* Send data from the device

This basic usage can have a wide range of variations. In the following sections each step will be described in detail. 

NOTE: this first version doesn't support Configuration provisioning, so each device must be provisioned individually. 

### Starting the agent
In order to start the agent, execute the following command from the root of the project:
```
bin/iotagent
```

### Provisioning the device in the Agent
To provision the device, use the API provided in [Device Provisioning API](https://github.com/telefonicaid/iotagent-node-lib#-device-provisioning-api) with the following changes:
* No attributes need to be defined in this version. All the Sigfox parameters and data fields will be mapped to their correspondent attributes in the NGSI Request. This behavior will change in the near future to adhere to the common IoT Agent provisioning style.
* A special internal attribute called `mapping` **must** be provided, containing the structure of the `data` attribute of the device.

The following code fragment shows the body of a device provisioning for a sigfox device. End to end examples of this provisioning can be found in the `/test` folder.
```
{
  "name": "sigApp2",
  "service" : "dumbMordor",
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
If the default mapping mechanism is not powerful enough to fit your needs, custom plugins can be developed for data parsing.
Parse plugins are standard node.js modules, and will be required with a `require()` instruction, so there are two ways of
providing the module:

* Registering the module in the NPM Registry and installing it in the IoT Agent.
* Copying the module file in the IoT Agent folder and referring to the file using a relative path.

In both cases, the plugin must be configured in the device provisioning request, by using the `plugin` internal attribute.
This attribute replace the mandatory `mapping` attribute. In case both exists, the `mapping` attribute takes precedence.

The module may contain any node.js code, but it **must** export a function called `parse()` with the following signature:
```
function parse(data, callback);
```
This function will be invoked any time a new piece of data comes to the IoT Agent for a device configured with the plugin.
The `data` parameter, in that case, will contain the measure payload in string format. The `callback()` must be invoked
once the parsing process has finished with one of the following results:
* If the parse was successfull, two parameters **must** be passed to the callback: a first `null` value, indicating there
was no error; and a single object parameter, having one attribute for each of the values in the payload. Each one of this
attributes will be mapped to an entity attribute in the Context Entity.
* If there was any error parsing, a new error object should be created, and passed as the first parameter to the callback.
This error object should contain, at least, a `name` parameter indicating the error name and a `code` parameter suggesting
a code to return to the caller.

The following example shows a provisioning of a device with a plugin. This example can be seen working in the tests section.
```
{
  "name": "sigApp3",
  "service" : "dumbMordor",
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
For a detailed description of the creation device process in the Sigfox backend, please, refer to the Sigfox documentation. 

In order to create the callback URL, use the port value configured in the `config.js` file (in particular `config.sigfox.port` parameter). The default port in the configuration is the **17428**. The default path for incoming callbacks is not configurable and is hardwired to `/update`. This version of the Agent only supports 'GET' callbacks.

There is no default data mapping for the device's data. Use the same device mapping you introduced in the provisioning step.

### Sending data from the device
To aid in testing purposes, a test client is being developed to simulate device callbacks. In order to launch it, use the following command from the root folder:
```
bin/sigfox-test.js
```
This command launches a test shell with the following commands:
```
showParameters  

	Show the current device parameters that will be sent along with the callback

setParameters <name> <value>  

	Set the value for the selected parameter

sendMeasure <data>  

	Send a measure to the defined endpoint, with the defined parameters and the data passed to the command
```
The test shell stores a map of the parameters that will be sent as query parameters of the callback. To show the paramaters, use `showParameters`. In order to change any of them, use the `testParameters` command. This parameters will be common for all the requests originating from the test tool. In order to send a measure use `sendMeasure`. Take special care with this command, as it doesn't check whether the format of the data is right or not; in the later case, an error will be risen in the data parsing in the IoT Agent, leading to unpredictable results. The expected `data` format is the one defined in the device provisioning.

## <a name="dataformat"/>  Data format
Here is an example of the currently supported data formats:
```
counter::uint:32  param1::uint:32 param2::uint:8 tempDegreesCelsius::uint:8  voltage::uint:16
```
The supported format has to adhere to the following rules:
* The format is composed of **N** fields, sepparated by spaces.
* Each field is composed of two parts, sepparated by the pattern `::`. The first part will be taken to be the name of the attribute, the second one the definition of the value type.
* The definition of the value type is composed of two parts, sepparated by a colon `:`. The first part indicates the type of data (e.g.: integer, float, etc.). The one supported type currently is `uint` (unsigned integer). The second part indicates the size in bytes of the data.

Given this rules and the format example given, the following piece of data, `000000020000000000230c6f` would have the following values (expressed in decimal base):
* counter: 2
* param1: 0
* param2: 0
* tempDegreesCelsius: 35
* voltage: 3183

## <a name="development"/>  Development documentation
### Project build
The project is managed using Grunt Task Runner.

For a list of available task, type
```bash
grunt --help
```

The following sections show the available options in detail.


### Testing
[Mocha](http://mochajs.org/) Test Runner + [Chai](http://chaijs.com/) Assertion Library + [Sinon](http://sinonjs.org/) Spies, stubs.

The test environment is preconfigured to run [BDD](http://chaijs.com/api/bdd/) testing style with
`chai.expect` and `chai.should()` available globally while executing tests, as well as the [Sinon-Chai](http://chaijs.com/plugins/sinon-chai) plugin.

Module mocking during testing can be done with [proxyquire](https://github.com/thlorenz/proxyquire)

To run tests, type
```bash
grunt test
```

Tests reports can be used together with Jenkins to monitor project quality metrics by means of TAP or XUnit plugins.
To generate TAP report in `report/test/unit_tests.tap`, type
```bash
grunt test-report
```


### Coding guidelines
jshint, gjslint

Uses provided .jshintrc and .gjslintrc flag files. The latter requires Python and its use can be disabled
while creating the project skeleton with grunt-init.
To check source code style, type
```bash
grunt lint
```

Checkstyle reports can be used together with Jenkins to monitor project quality metrics by means of Checkstyle
and Violations plugins.
To generate Checkstyle and JSLint reports under `report/lint/`, type
```bash
grunt lint-report
```


### Continuous testing

Support for continuous testing by modifying a src file or a test.
For continuous testing, type
```bash
grunt watch
```


### Source Code documentation
dox-foundation

Generates HTML documentation under `site/doc/`. It can be used together with jenkins by means of DocLinks plugin.
For compiling source code documentation, type
```bash
grunt doc
```


### Code Coverage
Istanbul

Analizes the code coverage of your tests.

To generate an HTML coverage report under `site/coverage/` and to print out a summary, type
```bash
# Use git-bash on Windows
grunt coverage
```

To generate a Cobertura report in `report/coverage/cobertura-coverage.xml` that can be used together with Jenkins to
monitor project quality metrics by means of Cobertura plugin, type
```bash
# Use git-bash on Windows
grunt coverage-report
```


### Code complexity
Plato

Analizes code complexity using Plato and stores the report under `site/report/`. It can be used together with jenkins
by means of DocLinks plugin.
For complexity report, type
```bash
grunt complexity
```

### PLC

Update the contributors for the project
```bash
grunt contributors
```


### Development environment

Initialize your environment with git hooks.
```bash
grunt init-dev-env 
```

We strongly suggest you to make an automatic execution of this task for every developer simply by adding the following
lines to your `package.json`
```
{
  "scripts": {
     "postinstall": "grunt init-dev-env"
  }
}
``` 


### Site generation

There is a grunt task to generate the GitHub pages of the project, publishing also coverage, complexity and JSDocs pages.
In order to initialize the GitHub pages, use:

```bash
grunt init-pages
```

This will also create a site folder under the root of your repository. This site folder is detached from your repository's
history, and associated to the gh-pages branch, created for publishing. This initialization action should be done only
once in the project history. Once the site has been initialized, publish with the following command:

```bash
grunt site
```

This command will only work after the developer has executed init-dev-env (that's the goal that will create the detached site).

This command will also launch the coverage, doc and complexity task (see in the above sections).

