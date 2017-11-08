var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

// Mongoose

mongoose.Promise = global.Promise;

var mongoDB = 'mongodb://127.0.0.1/instafan';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Body Parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Server got a request.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'The API is working!' });   
});

app.use('/users', require('./app/routes/users'));
app.use('/auth', require('./app/routes/auth'));

// Config

const PORT = process.env.PORT || 8000;

app.listen(PORT);
console.log(`Listening on port ${PORT}`);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});