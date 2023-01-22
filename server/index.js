import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { registerValidator } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register } from './controllers/UserController.js';

const app = express();
dotenv.config();
app.use(express.json());
mongoose.set('strictQuery', false);

//* Constants
const PORT = process.env.PORT || 4001;
const MDB_USER = process.env.MDB_USER;
const MDB_PASSWORD = process.env.MDB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// * Mongoose DB connection
mongoose
  .connect(
    `mongodb+srv://${MDB_USER}:${MDB_PASSWORD}@cluster0.ultdy6c.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => console.log('DB is OK!'))
  .catch((err) => console.log('DB connection ERROR:', err));

app.post('/auth/register', registerValidator, register);

app.post('/auth/login', login);

app.get('/auth/me', checkAuth, getMe);

// * *************************** Server Connection ********************************   //
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on PORT: ${PORT}`);
});
