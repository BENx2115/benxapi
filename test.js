const benxApi = require('./index');
const request = new benxApi({ urlBase: 'https://4.myip.is', token: 'none' });

request.get('/')
    .then(response => console.log(response.data))
    .catch(console.error);
