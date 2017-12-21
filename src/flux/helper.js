// instantiate the Flux SDK with your appliation key
import {config} from './config.js';
import FluxHelpers from 'flux-sdk-helpers';
import FluxSdk from 'flux-sdk-browser';;

var sdk = new FluxSdk(config.flux_client_id, { redirectUri: config.url, fluxUrl: config.flux_url })
var helpers = new FluxHelpers(sdk)
var user = null
var dataTables = {}

/**
 * Get the Flux user.
 */
var getUser= function () {
    if (!user) {
        user = helpers.getUser()
    }
    return user
};

/**
 * Get the user's Flux projects.
 */
var getProjects = function () {
    return getUser().listProjects()
};

/**
 * Get a project's data table.
 */
var getDataTable =function (project) {
    if (!(project.id in dataTables)) {
        var dt = getUser().getDataTable(project.id)
        dataTables[project.id] = { table: dt, handlers: {}, websocketOpen: false }
    }
    return dataTables[project.id]
};

/**
 * Get a list of the project's cells (keys).
 */
var getCells = function(project) {
    return getDataTable(project).table.listCells()
};

/**
 * Get a specific project cell (key).
 */
var getCell = function (project, cell) {
    return getDataTable(project).table.getCell(cell.id)
};

/**
 * Get the value contained in a cell (key).
 */
var getValue = function(project, cell) {
    return getCell(project, cell).fetch()
};
export {helpers, getUser, getProjects, getCells,getCell, getDataTable, getValue};
