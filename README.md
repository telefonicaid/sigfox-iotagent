# sigfox-iotagent

* [Overview](#overview)
* [Usage](#usage)
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

## <a name="usage"/>  Usage
### Basic usage
The basic usage of this IoT Agent is the same as any other. In order to have the Device working follow this steps:
* Start the agent
* Provision the device in the Agent using the [Device Provisioning API](https://github.com/telefonicaid/iotagent-node-lib#-device-provisioning-api)
* Configure de Sigfox Backend to send a callback to the backend
* Send data from the device

This basic usage can have a wide range of variations. In the following sections each step will be described in detail. 

NOTE: this first version doesn't support Configuration provisioning, so each device must be provisioned individually. 

## <a name="development"/>  Development documentation
### Project build
The project is managed using Grunt Task Runner.

For a list of available task, type
```bash
grunt --help
```

The following sections show the available options in detail.


### Testing
[Mocha](http://visionmedia.github.io/mocha/) Test Runner + [Chai](http://chaijs.com/) Assertion Library + [Sinon](http://sinonjs.org/) Spies, stubs.

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

