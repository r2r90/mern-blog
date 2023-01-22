import PostModel from '../models/Post.js';
import { validationResult } from 'express-validator';

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error: Invalid input. Please check your post for any errors and try again.',
    });
  }
};

export const getALl = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error: Unable to load posts.',
    });
  }
};

export const getOne = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Error: Unable to load the post.',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Unable to find the post.',
          });
        }

        res.json(doc);
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error: Unable to load posts.',
    });
  }
};

export const remove = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Error: Unable to delete the post.',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Unable to find the post.',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error: Unable to load post.',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error: Unable to update post.',
    });
  }
};
