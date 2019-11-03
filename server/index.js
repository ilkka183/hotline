const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

require('./startup/routes')(app);

const connection = require('./connection');
connection.connect();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
