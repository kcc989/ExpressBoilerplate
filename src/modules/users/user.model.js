import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { passwordReg } from './user.validations';
import { hashSync, compareSync, genSaltSync } from 'bcrypt-nodejs';

const SALT_ROUNDS = 10;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email)
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  salt: {
    type: String
  },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'LastName is required!'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [7, 'Password needs to be longer'],
    validate: {
      validator(password) {
        return passwordReg.test(password)
      },
      message: 'Invalid password'
    }
  }
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
      this.salt = this._genSalt();
      this.password = this._hashPassword(this.password, this.salt);
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password, salt) {
      return hashSync(password, salt);
  },
  _genSalt() {
    return genSaltSync(SALT_ROUNDS);
  },
  authenticateUser(password) {
      return compareSync(password, this.password);
  },
};

export default mongoose.model('User', UserSchema);