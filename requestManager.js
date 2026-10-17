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
async function request(method = 'GET', token, url, data, requestOptions = {}) {
    return new Promise((resolve, reject) => {
        let settled = false;
        let timeout;
        let signal;
        let stream;
        let req;

        const cleanup = () => {
            if (timeout) clearTimeout(timeout);
            if (signal) signal.removeEventListener('abort', abortRequest);
        };

        const rejectOnce = (error) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(error);
        };

        const responseData = (res, response) => ({
            req,
            res,
            statusCode: res.statusCode || 0,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            headers: res.headers,
            ...response
        });

        const resolveOnce = (value) => {
            if (settled) return;
            settled = true;
            cleanup();
            resolve(value);
        };

        const abortRequest = () => {
            const error = new Error('The request was aborted.');
            error.name = 'AbortError';
            if (req) req.destroy(error);
            else rejectOnce(error);
        };

        try {
            const urlData = new URL(url);
            if (urlData.protocol !== 'http:' && urlData.protocol !== 'https:') {
                throw new TypeError('Only HTTP and HTTPS URLs are supported.');
            }
            const protocol = urlData.protocol === 'http:' ? http : https;

            const requestConfig = {
                hostname: urlData.hostname,
                port: urlData.port || (urlData.protocol === 'https:' ? 443 : 80),
                path: urlData.pathname + (urlData.search || ''),
                method: method,
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    ...token ? { 'Authorization': token } : {},
                    'Content-Type': 'application/json'
                },
            };

            const postData = method !== 'GET' && data !== undefined
                ? JSON.stringify(data)
                : undefined;
            if (postData !== undefined) {
                requestConfig.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            signal = requestOptions.signal;
            const maxBytes = requestOptions.maxBytes;
            const returnData = requestOptions.returnData;
            const timeoutMs = requestOptions.timeoutMs;

            req = protocol.request(requestConfig, (res) => {
                stream = res;
                res.on('error', rejectOnce);
                res.on('aborted', () => rejectOnce(new Error('The response was aborted.')));
                if (res.headers['content-encoding'] === 'gzip') {
                    stream = res.pipe(zlib.createGunzip());
                } else if (res.headers['content-encoding'] === 'deflate') {
                    stream = res.pipe(zlib.createInflate());
                } else if (res.headers['content-encoding'] === 'br') {
                    stream = res.pipe(zlib.createBrotliDecompress());
                }

                stream.on('error', rejectOnce);

                if (!returnData) {
                    resolveOnce(responseData(res, {}));
                    res.resume();
                    return;
                }

                const chunks = [];
                let downloadedSize = 0;

                stream.on('data', (chunk) => {
                    if (settled) return;
                    if (maxBytes > 0) {
                        const remaining = maxBytes - downloadedSize;
                        const limitedChunk = chunk.subarray(0, remaining);
                        chunks.push(limitedChunk);
                        downloadedSize += limitedChunk.length;

                        if (downloadedSize === maxBytes) {
                            resolveOnce(responseData(res, { data: Buffer.concat(chunks) }));
                            req.destroy();
                        }
                        return;
                    }

                    chunks.push(chunk);
                });

                stream.on('end', () => {
                    if (settled) return;
                    const buffer = Buffer.concat(chunks);
                    if (maxBytes > 0) {
                        resolveOnce(responseData(res, { data: buffer }));
                        return;
                    }

                    let data;
                    try {
                        data = JSON.parse(buffer.toString());
                    } catch {
                        data = buffer.toString();
                    }
                    resolveOnce(responseData(res, { data }));
                });
            });

            req.on('error', rejectOnce);

            if (postData !== undefined) req.write(postData);

            if (timeoutMs > 0) {
                timeout = setTimeout(() => {
                    const error = new Error(`Request timed out after ${timeoutMs} ms.`);
                    error.name = 'TimeoutError';
                    req.destroy(error);
                }, timeoutMs);
            }

            if (signal?.aborted) {
                abortRequest();
                return;
            }
            signal?.addEventListener('abort', abortRequest, { once: true });

            req.end();
        } catch (error) {
            rejectOnce(error);
        }
    });
};

module.exports = request;
