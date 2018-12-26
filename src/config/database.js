import mongoose from 'mongoose';
 
 mongoose.Promise = global.Promise;
 
 try {
   if (process.env.NODE_ENV === 'test') {
     mongoose.connect(process.env.MONGO_TEST_URL);
   } else {
    mongoose.connect(process.env.MONGO_URL)
   }
 } catch (err) {
   if (process.env.NODE_ENV === 'test') {
    mongoose.createConnection(process.env.MONGO_TEST_URL);
   } else {
    mongoose.createConnection(process.env.MONGO_URL);
   }
 }
 mongoose.connection.once('open', () => console.log('MongoDB Running')).on('error', e => {
     throw e;
 })