const requestManager = require('./requestManager');

function normalizeRequestOptions(options) {
    if (options === null || typeof options !== 'object' || Array.isArray(options)) {
        throw new TypeError('"options" must be an object.');
    }

    const normalized = {
        maxBytes: options.maxBytes === undefined ? 0 : options.maxBytes,
        returnData: options.returnData === undefined ? true : options.returnData,
        timeoutMs: options.timeoutMs === undefined ? 30000 : options.timeoutMs,
        signal: options.signal
    };

    if (!Number.isSafeInteger(normalized.maxBytes) || normalized.maxBytes < 0) {
        throw new TypeError('"options.maxBytes" must be a non-negative integer.');
    }
    if (typeof normalized.returnData !== 'boolean') {
        throw new TypeError('"options.returnData" must be a boolean.');
    }
    if (!Number.isFinite(normalized.timeoutMs) || normalized.timeoutMs < 0) {
        throw new TypeError('"options.timeoutMs" must be a non-negative number.');
    }
    if (normalized.signal !== undefined &&
        (normalized.signal === null ||
            typeof normalized.signal.addEventListener !== 'function' ||
            typeof normalized.signal.removeEventListener !== 'function' ||
            typeof normalized.signal.aborted !== 'boolean')) {
        throw new TypeError('"options.signal" must be an AbortSignal.');
    }

    return normalized;
}

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
        if (options && typeof options !== 'object') throw new SyntaxError('Options must be an object.');

        if (options?.urlBase) {
            if (typeof options.urlBase !== 'string') throw new SyntaxError('The "urlBase" must be a string.');

            this.urlBase = options.urlBase;
        } else {
            this.urlBase = '';
        }

        if (options?.token) {
            if (typeof options.token !== 'string') throw new SyntaxError('The "token" must be a string.');

            this.token = options.token;
        }
    }

    /**
     * 'GET' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [options={}] - Request options
     * @param {number} [options.maxBytes=0] - Limit returned response data bytes after decompression
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @param {number} [options.timeoutMs=30000] - Request timeout in milliseconds; 0 disables it
     * @param {AbortSignal} [options.signal] - Signal used to cancel the request
     * @returns {Promise<Object>} - Includes statusCode, ok, headers, req, res, and optionally data
     * @throws {Error} - Throws an error if the URL is not a string
     */
    async get(url, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        const requestOptions = normalizeRequestOptions(options);

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('GET', this.token, requestURL, {}, requestOptions);
        } catch (error) {
            const requestError = new Error(`GET request (${requestURL}) failed: ${error.message}`);
            requestError.name = error.name || 'Error';
            requestError.cause = error;
            throw requestError;
        }
    }

    /**
     * 'POST' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [data] - Optional data transmitted in the body
     * @param {Object} [options={}] - Request options
     * @param {number} [options.maxBytes=0] - Limit returned response data bytes after decompression
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @param {number} [options.timeoutMs=30000] - Request timeout in milliseconds; 0 disables it
     * @param {AbortSignal} [options.signal] - Signal used to cancel the request
     * @returns {Promise<Object>} - Includes statusCode, ok, headers, req, res, and optionally data
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async post(url, data = {}, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof data !== 'object' || data === null) throw new Error('"data" must be an object');
        const requestOptions = normalizeRequestOptions(options);

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('POST', this.token, requestURL, data, requestOptions);
        } catch (error) {
            const requestError = new Error(`POST request (${requestURL}) failed: ${error.message}`);
            requestError.name = error.name || 'Error';
            requestError.cause = error;
            throw requestError;
        }
    }

    /**
     * 'PUT' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [data={}] - The data transmitted in the body
     * @param {Object} [options={}] - Request options
     * @param {number} [options.maxBytes=0] - Limit returned response data bytes after decompression
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @param {number} [options.timeoutMs=30000] - Request timeout in milliseconds; 0 disables it
     * @param {AbortSignal} [options.signal] - Signal used to cancel the request
     * @returns {Promise<Object>} - Includes statusCode, ok, headers, req, res, and optionally data
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async put(url, data = {}, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (typeof data !== 'object' || data === null) throw new Error('"data" must be an object');
        const requestOptions = normalizeRequestOptions(options);

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('PUT', this.token, requestURL, data, requestOptions);
        } catch (error) {
            const requestError = new Error(`PUT request (${requestURL}) failed: ${error.message}`);
            requestError.name = error.name || 'Error';
            requestError.cause = error;
            throw requestError;
        }
    }

    /**
     * 'DELETE' method to query something
     * @param {string} url - The API endpoint
     * @param {Object} [data] - Optional data transmitted in the body
     * @param {Object} [options={}] - Request options
     * @param {number} [options.maxBytes=0] - Limit returned response data bytes after decompression
     * @param {boolean} [options.returnData=true] - Whether to return the data or just the response headers
     * @param {number} [options.timeoutMs=30000] - Request timeout in milliseconds; 0 disables it
     * @param {AbortSignal} [options.signal] - Signal used to cancel the request
     * @returns {Promise<Object>} - Includes statusCode, ok, headers, req, res, and optionally data
     * @throws {Error} - Throws an error if the URL is not a string or options is not an object
     */
    async delete(url, data, options = {}) {
        if (typeof url !== 'string') throw new Error('"url" must be a string');
        if (data !== undefined && (typeof data !== 'object' || data === null)) {
            throw new Error('"data" must be an object');
        }
        const requestOptions = normalizeRequestOptions(options);

        const requestURL = this.urlBase + url;

        try {
            return await requestManager('DELETE', this.token, requestURL, data, requestOptions);
        } catch (error) {
            const requestError = new Error(`DELETE request (${requestURL}) failed: ${error.message}`);
            requestError.name = error.name || 'Error';
            requestError.cause = error;
            throw requestError;
        }
    }
};

module.exports = benxApi;
