'use strict';

let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./data/db'),
  createError = require('http-errors');

mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('Database connected sucessfully');
},
  error => {
  console.log('Could not connect to database: ' + error);
  });

const studentRoute = require('./routes/student.route');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/mean-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-app')));
app.use('/api', studentRoute);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log(err.message);
  if(!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
