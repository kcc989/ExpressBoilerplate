import hat from 'hat';
import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const SessionSchema = new Schema({
  createdDate: {
    type: Date,
    required: true,
    default: () => moment().toDate()
  },
  expirationDate: {
    type: Date,
    required: true,
    default: () => moment().add(30, 'days').toDate()
  },
  token: {
    type: String,
    unique: true,
    required: true,
    default: () => hat()
  },
  userId: {
    type: String,
    required: true
  }
});

SessionSchema.methods = {
  isExpired() {
    return this.expirationDate <= moment().toDate();
  }
}

export default mongoose.model('Session', SessionSchema);