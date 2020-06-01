const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const apiMessage = require('./api/message');
const apiFighters = require('./api/fighters');

const app = express();
app.use(morgan(':req[X-Forwarded-For] :method :url :status :response-time ms :res[content-length]'));
app.use(helmet());
app.use(cors());

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the salty-prophet api!',
  });
});

app.use('/api/message', apiMessage);
app.use('/api/fighters', apiFighters);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.API_PORT || 1313;
app.listen(port, () => {
  console.log(`Listening at https://localhost:${port}`);
});
