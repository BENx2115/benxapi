const assert = require('assert');
const http = require('http');
const zlib = require('zlib');
const benxApi = require('./index');

async function run() {
    const server = http.createServer((req, res) => {
        if (req.url === '/not-found') {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'not found' }));
            return;
        }

        if (req.url === '/large') {
            res.end('abcdef');
            return;
        }

        if (req.url === '/gzip') {
            res.writeHead(200, { 'Content-Encoding': 'gzip' });
            res.end(zlib.gzipSync('abcdef'));
            return;
        }

        if (req.url === '/slow') {
            setTimeout(() => res.end('too late'), 150);
            return;
        }

        if (req.url === '/delete' && req.method === 'DELETE') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(body);
            });
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const api = new benxApi({ urlBase: `http://127.0.0.1:${server.address().port}` });

    try {
        const defaultOptions = await api.get('/', {});
        console.log(defaultOptions.data);
        assert.deepStrictEqual(defaultOptions.data, { success: true });
        assert.strictEqual(defaultOptions.statusCode, 200);
        assert.strictEqual(defaultOptions.ok, true);

        const notFound = await api.get('/not-found');
        console.log(notFound.data);
        assert.strictEqual(notFound.statusCode, 404);
        assert.strictEqual(notFound.ok, false);
        assert.deepStrictEqual(notFound.data, { message: 'not found' });

        const deleted = await api.delete('/delete', { id: 42 });
        console.log(deleted.data);
        assert.deepStrictEqual(deleted.data, { id: 42 });

        const cappedResponse = await api.get('/large', { maxBytes: 3 });
        console.log(cappedResponse.data);
        assert.strictEqual(Buffer.isBuffer(cappedResponse.data), true);
        assert.strictEqual(cappedResponse.data.toString(), 'abc');

        const responseBelowLimit = await api.get('/large', { maxBytes: 10 });
        console.log(responseBelowLimit.data);
        assert.strictEqual(Buffer.isBuffer(responseBelowLimit.data), true);
        assert.strictEqual(responseBelowLimit.data.toString(), 'abcdef');

        const cappedCompressedResponse = await api.get('/gzip', { maxBytes: 3 });
        console.log(cappedCompressedResponse.data);
        assert.strictEqual(cappedCompressedResponse.data.toString(), 'abc');

        const headersOnly = await api.get('/', { returnData: false });
        console.log(headersOnly.data);
        assert.strictEqual(headersOnly.statusCode, 200);
        assert.strictEqual(Object.prototype.hasOwnProperty.call(headersOnly, 'data'), false);

        await assert.rejects(
            api.get('/slow', { timeoutMs: 20 }),
            (error) => error.name === 'TimeoutError'
        );

        const controller = new AbortController();
        const abortRequest = api.get('/slow', { signal: controller.signal });
        setTimeout(() => controller.abort(), 20);
        await assert.rejects(abortRequest, (error) => error.name === 'AbortError');

        await assert.rejects(
            api.get('/', { maxBytes: -1 }),
            /maxBytes/
        );
        await assert.rejects(
            api.get('/', { maxBytes: null }),
            /maxBytes/
        );
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
