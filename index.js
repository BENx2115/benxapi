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

        if (!options.urlBase) throw new SyntaxError('No "urlBase" provided.');
        if (typeof options.urlBase !== 'string') throw new SyntaxError('The "urlBase" must be a string.');

        this.urlBase = options.urlBase;

        if (!options.token) throw new SyntaxError('No "token" provided.');
        if (typeof options.token !== 'string') throw new SyntaxError('The "token" must be a string.');

        this.token = options.token;
    }

    /**
     * 'GET' method to query something
     * @param {string} url - The API endpoint
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string
     */
    async get(url) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('GET', this.token, requestURL);
        } catch (error) {
            throw new Error(`GET request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'POST' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [options={}] - The data transmitted in the body
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async post(url, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof options !== 'object' || options === null) throw new Error('"options" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('POST', this.token, requestURL, options);
        } catch (error) {
            throw new Error(`POST request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'PUT' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [options={}] - The data transmitted in the body
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async put(url, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof options !== 'object' || options === null) throw new Error('"options" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('PUT', this.token, requestURL, options);
        } catch (error) {
            throw new Error(`PUT request (${requestURL}) failed: ${error.message}`);
        }
    }

    /**
     * 'DELETE' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [options={}] - The data transmitted in the body
     * @returns {Promise<Object>} - The response of the API
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async delete(url, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof options !== 'object' || options === null) throw new Error('"options" must be an object');

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('DELETE', this.token, requestURL, options);
        } catch (error) {
            throw new Error(`DELETE request (${requestURL}) failed: ${error.message}`);
        }
    }
};

module.exports = benxApi;
