var express    = require('express');
var app        = module.exports = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan 	   = require('morgan');
var config 	   = require('./config');

// Mongoose

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// App Config

app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log requests to the console
app.use(morgan('dev'));

// Router

var router = express.Router();

app.get('/', function(req, res) {
    res.json({ status: 'OK', message: 'API running!' });
});

app.use('/auth', require('./app/routes/auth'));
app.use('/users', require('./app/routes/users'));
app.use('/campaigns', require('./app/routes/campaigns'));

// Server Config

const PORT = process.env.PORT || 8000;

app.listen(PORT);
console.log(`Listening on port ${PORT}`);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});