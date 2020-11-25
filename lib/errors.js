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

class MandatoryFieldsNotFound {
    constructor(notFoundParams) {
        this.name = 'MANDATORY_FIELDS_NOT_FOUND';
        this.message = 'Some of the mandatory fields for the request were not found: ' + JSON.stringify(notFoundParams);
        this.code = 400;
    }
}
class DataMappingNotFound {
    constructor(type) {
        this.name = 'DATA_MAPPING_NOT_FOUND';
        this.message = 'No data mapping was found for type [' + type + ']';
        this.code = 400;
    }
}
class ErrorLoadingPlugin {
    constructor(plugin) {
        this.name = 'ERROR_LOADING_PLUGIN';
        this.message = 'The plugin [' + plugin + '] could not be found or loaded';
        this.code = 400;
    }
}

module.exports = {
    MandatoryFieldsNotFound,
    DataMappingNotFound,
    ErrorLoadingPlugin
};
