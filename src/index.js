const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const logger = require('./logger');
const companies = require('./routes/companies');
const users = require('./routes/users');

const { PORT } = process.env;

const app = express();
app.use(express.static('public/avatars'));
// base middlewares
app.use(bodyParser.json());

// routing
app.use(...companies);
app.use(...users);

app.listen(PORT, () => {
  logger.log(`Example app listening at http://localhost:${PORT}`);
});
