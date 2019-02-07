## Installation

There are two ways of installing the Sigfox IoT Agent: cloning the Github repository, or using Docker.

### Using GitHub

In order to use the IoT Agent, you can just clone the GitHub repository and use the default configuration. You can use
the following command:

```bash
git clone https://github.com/telefonicaid/sigfox-iotagent.git
```

### Using Docker

If you are using Docker, you can download the latest Sigfox IoTAgent module from Docker Hub, in order to try it. Do not
use this installation mode for production purposes.

The Docker module has the prerequisite of having a Orion Context Broker that must be linked on start for the module to
work. There is currently just one simple configuration offered for the IOTA, with in-memory transient storage (in the
future, more configurations will be available).

If there is a docker container running with the Context Broker and name orion, the following command will start a
Thinking Things IoT Agent:

```bash
docker run -t -i --link orion:orion -p 4041:4041 -p 17428:17428 fiware/sigfox-iotagent
```
