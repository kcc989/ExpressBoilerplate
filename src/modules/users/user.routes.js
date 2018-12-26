import {
  Router
} from 'express';
import validate from 'express-validation';

import * as sessionController from '../sessions/session.controller';
import * as userController from './user.controllers';
import userValidation from './user.validations';
import { authLocal, authToken } from '../../auth';


const routes = new Router();
routes.post('/signup', validate(userValidation.signup), userController.signUp);
routes.post('/login', authLocal, sessionController.createSession);
routes.get('/test', authToken, userController.test);
export default routes;