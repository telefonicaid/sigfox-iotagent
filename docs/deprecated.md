# Deprecated functionality

Deprecated features are features that sigfox-iotagent stills support but that are not maintained or evolved any longer. In
particular:

-   Bugs or issues related with deprecated features and not affecting any other feature are not addressed (they are
    closed in github.com as soon as they are spotted).
-   Documentation on deprecated features is removed from the repository documentation. Documentation is still available
    in the documentation set associated to older versions (in the repository release branches).
-   Deprecated functionality is eventually removed from sigfox-iotagent. Thus you are strongly encouraged to change your
    implementations using sigfox-iotagent in order not rely on deprecated functionality.

A list of deprecated features and the version in which they were deprecated follows:

-   Support to NGSI v1 (finally removed in 1.6.0)
-   Support to Node.js v4 and v6 in sigfox-iotagent 1.0.0 (finally removed in 1.1.0)
-   Support to Node.js v8 in sigfox-iotagent 1.4.0 (finally removed in 1.5.0)
-   Support to Node.js v10 in sigfox-iotagent 1.5.0 (finally removed in 1.6.0)
-   Support to NGSI-LD v1.3 in sigfox-iotagent 1.7.0

The use of Node.js v14 is highly recommended.

## Using old sigfox-iotagent versions

Although you are encouraged to use always the newest sigfox-iotagent version, take into account the following information in
the case you want to use old versions:

-   Code corresponding to old releases is available at the
    [sigfox-iotagent GitHub repository](https://github.com/telefonicaid/sigfox-iotagent). Each release number (e.g. 1.7.0 ) has
    associated the following: - A tag, e.g. `1.7.0`. It points to the base version. - A release branch, `release/1.7.0`.
    The HEAD of this branch usually matches the aforementioned tag. However, if some hotfixes were developed on the base
    version, this branch contains such hotfixes.
-   Documentation corresponding to old versions can be found at
    [readthedocs.io](https://iotagent-sigfox.readthedocs.io/en/latest/). Use the panel in the right bottom corner to navigate to
    the right version.
-   Docker images corresponding to sigfox-iotagent can be found at
    [Dockerhub](https://hub.docker.com/r/fiware/sigfox-iotagent/tags/).

The following table provides information about the last sigfox-iotagent version supporting currently removed features:

| **Removed feature**    | **Last sigfox-iotagent version supporting feature** | **That version release date** |
| ---------------------- | --------------------------------------------------- | ----------------------------- |
| NGSIv1 API             | 1.5.0                                               | March 3rd, 2021               |
| Support to Node.js v4  | 1.0.0                                               | June 13th, 2018               |
| Support to Node.js v6  | 1.0.0                                               | June 13th, 2018               |
| Support to Node.js v8  | 1.4.0                                               | April 8th, 2020               |
| Support to Node.js v10 | 1.5.0                                               | March 3rd, 2021               |
