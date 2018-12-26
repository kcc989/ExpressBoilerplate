import moment from 'moment';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStategy from 'passport-http-bearer';

import Session from '../modules/sessions/session.model';
import User from '../modules/users/user.model';

const pwSettings = {
  usernameField: 'email',
  session: false,
};

const localStrategy = new LocalStrategy(pwSettings, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !user.authenticateUser(password)) {
      return done(null, false);
    } 

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

const tokenStrategy = new BearerStategy(async (token, done) => {
  try {
    const session = await Session.findOne({ token });

    if (!session) {
      return done(null, false);
    }

    if (session.isExpired()) {
      return done(null, false);
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return done(null, false);
    } 

    return done(null, user);

  } catch (e) {
    return done(e, false);
  }
});



passport.use(localStrategy);
passport.use(tokenStrategy);

export const authLocal = passport.authenticate('local', {session: false});
export const authToken = passport.authenticate('bearer', {session: false, optional: false});

