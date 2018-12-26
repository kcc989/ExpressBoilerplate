import 'babel-polyfill';

import moment from 'moment';

import SessionModel from './session.model';

import { expect } from 'chai';


describe('Session tests', () => {
  describe('Session model tests', () => {
    const pastExpirationDate = moment().subtract(30, 'days').toDate();
    const userId = "foo";

    it('returns true expired if expiration date in the past', async () => {
      const session = await SessionModel.create({
        userId,
        expirationDate: pastExpirationDate
      });

      expect(session.isExpired()).to.be.true;
    });
    
    it('returns false expired if expiration date in the future', async () => {
      const session = await SessionModel.create({
        userId,
      });

      expect(session.isExpired()).to.be.false;
    });
  })
})