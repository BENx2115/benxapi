## Usage

### Creating a Client

To create a new client, you'll need a token for authentication:

```javascript
const benxApi = require('benxapi');

const request = new benxApi({ urlBase: 'http://api.example.com', token: 'yourToken' });
```

### Methods

#### `get(url)`

Sends a GET request to the specified URL.

- **Parameters:**
  - `url` (string): The API URL.
- **Returns:**
  - A Promise that contains the API response.

```javascript
request.get('/resource')
  .then(response => {
    console.log(response);
  })
  .catch(console.error);
```

#### `post(url, options = {})`

Sends a POST request to the specified URL.

- **Parameters:**
  - `url` (string): The API URL.
  - `options` (object, optional): The data to be sent in the request body.
- **Returns:**
  - A Promise that contains the API response.

```javascript
request.post('/resource', { key: 'value' })
  .then(response => {
    console.log(response);
  })
  .catch(console.error);
```

## Error Handling

The methods throw errors if:

- The `url` parameter is not of type `string`.
- The `options` parameter (where required) is not of type `object`.
- No token is provided.