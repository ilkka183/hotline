const express = require('express');
const cors = require('cors');

const auth = require('./routes/auth');
const data = require('./routes/data');
const lookup = require('./routes/lookup');
const query = require('./routes/query');
const table = require('./routes/table');
const traficom = require('./routes/traficom');

const app = express();

if (!process.env.hotline_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/data', data);
app.use('/api/lookup', lookup);
app.use('/api/query', query);
app.use('/api/table', table);
app.use('/api/traficom', traficom);

const connection = require('./connection');
connection.connect();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
