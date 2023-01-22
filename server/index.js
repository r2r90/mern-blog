import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';

import { UserController, PostController } from './controllers/index.js';
import { loginValidator, postCreateValidator, registerValidator } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
mongoose.set('strictQuery', false);

// * Image upload storage

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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

// * Routes

app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register); // ! ==>  New User Route
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login); // ! ==>  User Login Route
app.get('/auth/me', checkAuth, UserController.getMe); // ! ==>  Get User Info Route
app.get('/posts/:id', PostController.getOne); // ! ==>  Get One Post Route
app.get('/posts', PostController.getALl); // ! ==>  Get All Posts Route
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create); // ! ==>  Create New Post Route
app.patch(
  '/posts/:id',
  checkAuth,
  registerValidator,
  handleValidationErrors,
  PostController.update,
);
app.delete('/posts/:id', checkAuth, PostController.remove); // ! ==> Delete Post Route

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {    // ! ==>  Upload file Route
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// * *************************** Server Connection ********************************   //
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on PORT: ${PORT}`);
});
