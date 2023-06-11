import * as session from 'express-session';
// import { COOKIE_NAME, PRODUCTION } from '../utils/constants';
import { redis } from './redis';
import RedisStore from 'connect-redis';
// import { config } from 'dotenv';
// config();

export const sessionMiddleware = session({
  name: 'discord_test',
  store: new RedisStore({
    client: redis as any,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    sameSite: 'lax', // csrf
    secure: false, // cookie only works in https,
  },
  saveUninitialized: false,
  secret: '7}&nkf:dG(wwNz/+jEYhXr2Reff/{FGy!#28(/L8H]vuG;%[!Y~-7Qq',
  resave: true,
  rolling: true,
});
