const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UsersService = require('../../../services/users');
const { config } = require('../../../config');

const privateAuthJwtSecret = 'F6eamJo2IwnPkHLOKGzM05tcf3R7lhb9';

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret || privateAuthJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb) {
      const usersService = new UsersService();

      try {
        const user = await usersService.getUser({ email: tokenPayload.email });

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        delete user.password;

        cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        return cb(error);
      }
    }
  )
);
