require('dotenv').config();

const app = require('./app').app;

let port = app.get('port');

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});