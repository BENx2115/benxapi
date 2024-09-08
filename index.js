const requestManager = require('./requestManager');

class benxApi {
    /**
     * Creates the benxAPI Client
     * @param {Object} options - Configuration options for the client
     * @param {string} options.urlBase - The base URL for the API
     * @param {string} options.token - The API token for authentication
     * 
     * @example
     * const benxApi = require('benxapi');
     * const request = new benxApi({ urlBase: 'http://api.example.com', token: 'yourToken' });
     */
    constructor(options) {
        if (!options) throw new SyntaxError('No options provided.');
        if (typeof options !== 'object') throw new SyntaxError('Options must be an object.');

        if (options.urlBase) {
            if (typeof options.urlBase !== 'string') throw new SyntaxError('The "urlBase" must be a string.');

            this.urlBase = options.urlBase;
        } else {
            this.urlBase = '';
        }

        if (options.token) {
            if (typeof options.token !== 'string') throw new SyntaxError('The "token" must be a string.');

            this.token = options.token;
        }
    }

    /**
     * 'GET' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [options={}] - Request options like maxBytes, returnData
     * @param {number} [options.maxBytes=0] - Limit the response size in bytes
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string
     */
    async get(url, options = { maxBytes: 0, returnData: true }) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('GET', this.token, requestURL, {}, options.maxBytes, options.returnData);
        } catch (error) {
            throw new Error(`GET request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'POST' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} data - The data transmitted in the body
     * @param {Object} [options={}] - Request options like maxBytes, returnData
     * @param {number} [options.maxBytes=0] - Limit the response size in bytes
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async post(url, data = {}, options = { maxBytes: 0, returnData: true }) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof data !== 'object' || data === null) throw new Error('"data" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('POST', this.token, requestURL, data, options.maxBytes, options.returnData);
        } catch (error) {
            throw new Error(`POST request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'PUT' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} data - The data transmitted in the body
     * @param {Object} [options={}] - Request options like maxBytes, returnData
     * @param {number} [options.maxBytes=0] - Limit the response size in bytes
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async put(url, data = {}, options = { maxBytes: 0, returnData: true }) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof data !== 'object' || data === null) throw new Error('"data" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('PUT', this.token, requestURL, data, options.maxBytes, options.returnData);
        } catch (error) {
            throw new Error(`PUT request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'DELETE' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} data - The data transmitted in the body
     * @param {Object} [options={}] - Request options like maxBytes, returnData
     * @param {number} [options.maxBytes=0] - Limit the response size in bytes
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async delete(url, data = {}, options = { maxBytes: 0, returnData: true }) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof data !== 'object' || data === null) throw new Error('"data" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('DELETE', this.token, requestURL, data, options.maxBytes, options.returnData);
        } catch (error) {
            throw new Error(`DELETE request (${requestURL}) failed: ${error.message}`);
        }
    }
};

module.exports = benxApi;
