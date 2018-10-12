const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const Users = require('./models/Users');
const { JWT_SECRET } = require('./config');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        console.log('jwt payload', payload);

        // Find user decoded from token
        let user = await Users.findById(payload.sub);
        console.log('user from jw jwt payload', user);

        // If user doesn't exist, reject
        if (!user) {
          console.log('passport jwt no user');

          return done(null, false);
        }

        // Otherwise, return User
        done(null, user);
      } catch (err) {
        console.log(err);
        done(err, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await Users.findOne({ email });
        console.log('passport auth user', user);

        // If not found, handle error
        if (!user) {
          console.log('passport auth rejected');

          return done(null, false);
        }
        // Check if password is correct
        const doPassesMatch = await user.isPassValid(password);

        // If not, handle error
        if (!doPassesMatch) {
          console.log('passport auth rejected bad pass');

          return done(null, false);
        }

        // Else return user
        done(null, user);
      } catch (e) {
        done(e, false);
      }
    }
  )
);
