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
async function request(method = 'GET', token, url, data = {}, maxBytes = 0, returnData = true) {
    return new Promise((resolve, reject) => {
        try {
            const urlData = new URL(url);
            const protocol = urlData.protocol === 'http:' ? http : https;
            let downloadedSize = 0;

            const options = {
                hostname: urlData.hostname,
                port: urlData.port || (urlData.protocol === 'https:' ? 443 : 80),
                path: urlData.pathname + (urlData.search || ''),
                method: method,
                rejectUnauthorized: false,
                secureProtocol: 'TLSv1_2_method',
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    ...token ? { 'Authorization': token } : {},
                    'Content-Type': 'application/json',
                    ...maxBytes > 0 ? { 'Range': `bytes=0-${maxBytes}` } : {}
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

                if (returnData && maxBytes === 0) {
                    let response = [];
                    stream.on('data', (chunk) => {
                        response.push(chunk);
                    });

                    stream.on('end', () => {
                        const buffer = Buffer.concat(response);
                        try {
                            const data = JSON.parse(buffer.toString());
                            resolve({ req, res, data });
                        } catch (error) {
                            resolve({ req, res, data: buffer.toString() });
                        }
                    });
                } else if (maxBytes > 0) {
                    let response = [];
                    stream.on('data', (chunk) => {
                        downloadedSize += chunk.length;
                        if (downloadedSize > maxBytes) {
                            req.destroy();
                            resolve({ req, res, data: Buffer.concat(response) });
                        } else {
                            response.push(chunk);
                        }
                    });

                    stream.on('end', () => {
                        resolve({ req, res, data: Buffer.concat(response) });
                    });
                } else {
                    res.on('data', () => { });
                    resolve({ req, res });
                }
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (!['GET', 'DELETE'].includes(method) && data) {
                const postData = JSON.stringify(data);
                options.headers['Content-Length'] = Buffer.byteLength(postData);
                req.write(postData);
            }

            req.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = request;
