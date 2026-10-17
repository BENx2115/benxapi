# benxapi

A small Node.js client for making JSON HTTP requests.

## Usage

```javascript
const BenxApi = require('benxapi');

const api = new BenxApi({
  urlBase: 'https://api.example.com',
  token: 'yourToken'
});

(async () => {
  const response = await api.get('/resource');
  console.log(response.statusCode, response.ok, response.data);

  const created = await api.post('/resource', { key: 'value' }, {
    timeoutMs: 5000,
    maxBytes: 1024 * 1024
  });
})().catch(console.error);
```

The client provides `get`, `post`, `put`, and `delete`. The `url` argument is
appended to `urlBase`; POST and PUT bodies are JSON encoded. DELETE can also
send an optional JSON body.

## Request options

All methods accept an optional final options object:

- `maxBytes` (number, default `0`): maximum number of response data bytes to
  return. The limit is applied after decompression. When positive, `data` is a
  `Buffer`, including when the response is smaller than the limit. `0` means no
  size limit.
- `returnData` (boolean, default `true`): set to `false` to return after response
  headers arrive without reading a response body. In that case `data` is absent.
- `timeoutMs` (number, default `30000`): maximum time to wait for the request and
  response body. Set to `0` to disable the timeout.
- `signal` (AbortSignal): optionally cancel the request with an
  `AbortController`.

For example:

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

(async () => {
  const response = await api.get('/resource', {
    signal: controller.signal,
    returnData: false
  });
})().catch(console.error);
```

## Responses and errors

Each response contains `statusCode`, `ok`, `headers`, `req`, and `res`. When
`returnData` is `true`, `data` contains parsed JSON when possible, otherwise a
string; when `maxBytes` is positive, it contains a `Buffer`. `ok` is `true` for
HTTP status codes from 200 through 299. Non-2xx responses are returned normally,
so callers can inspect the status and error body.

Invalid request options and network, timeout, or abort failures reject the
returned promise. Network errors include the request method and URL; timeout
errors retain the `TimeoutError` name and abort errors retain the `AbortError`
name.
