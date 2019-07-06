const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  console.log('Serialize: ', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('Deserialize: ', id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    done(null, id);
  } else {
    User.findById(id, (err, user) => {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }
});

passport.use(
  new LocalStrategy(
    (req, username, password, done) => {
      console.log(req, username, password, done);
      User.findOne({ username })
        .then(user => {
          console.log(user);
          if (!user) {
            return done(null, false, req.flash('message', 'User not found'));
          }
          if (!user.validPassword(password)) {
            return done(
              null,
              false,
              req.flash('message', 'Incorrect password')
            );
          }
          return done(null, user);
        })
        .catch(err => done(err));
    }
  )
);