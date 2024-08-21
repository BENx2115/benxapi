const zlib = require('zlib');
const http = require('http');
const https = require('https');

/**
 * Internal function
 * @param {string} method CONNECT, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, TRACE
 * @param {string} url 
 * @param {object} data 
 * @returns 
 */
async function request(method = 'GET', token, url, data = {}) {
    return new Promise((resolve, reject) => {
        try {
            const urlData = new URL(url);

            const protocol = urlData.protocol === 'http:' ? http : https;

            const options = {
                hostname: urlData.hostname,
                port: urlData.port || urlData.protocol === 'https:' ? 443 : 80,
                path: urlData.pathname,
                method: method,
                rejectUnauthorized: false,
                secureProtocol: 'TLSv1_2_method',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br'
                },
            };

            const req = protocol.request(options, (res) => {
                let stream = res;

                if (res.headers['content-encoding'] === 'gzip') {
                    stream = res.pipe(zlib.createGunzip());
                } else if (res.headers['content-encoding'] === 'deflate') {
                    stream = res.pipe(zlib.createInflate());
                } else if (res.headers['content-encoding'] === 'br') {
                    stream = res.pipe(zlib.createBrotliDecompress());
                }

                let response = '';
                stream.on('data', (chunk) => {
                    response += chunk;
                });

                stream.on('end', () => {
                    try {
                        const data = JSON.parse(response);
                        resolve({ req, res, data });
                    } catch (error) {
                        resolve({ req, res, data: response });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (method !== 'GET' && data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = request;