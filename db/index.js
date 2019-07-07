const mongoose = require('mongoose');
const config = require('./config.json');

// Use native promises
mongoose.Promise = global.Promise; // es6 promise
let connectionURL;
if (process.env.NODE_ENV === 'development') {
  connectionURL = `mongodb://${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name}`;
} else {
  connectionURL = 'mongodb+srv://user:qwaszx123@alant-m2ed7.mongodb.net/test?retryWrites=true&w=majority';
}
mongoose.set('useCreateIndex', true);

mongoose.connect(connectionURL, { useNewUrlParser: true })
  .catch((e) => console.error(e));
const db = mongoose.connection;

require('./models/user');
require('./models/new');
// Check connection
db.on('connected', () => {
  console.log(`Mongoose connection open  on ${connectionURL}`)
});

// Check for Db errors
db.on('error', (err) => console.error(err));

// Check for disconected
db.on('disconnected', () => {
  console.log('mongoose connection disconnected')
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('mongoose connection closed throw app terminatatnio');
    process.exit(0);
  });
});
