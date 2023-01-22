import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js';
import UserModel from './models/User.js';

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

app.post('/auth/register', registerValidator, async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sign up failed!',
    });
  }
});

// * Server Connection
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on PORT: ${PORT}`);
});
