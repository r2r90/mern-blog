import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decodedToken = jwt.verify(token, 'secret123');
      req.userId = decodedToken._id;
      next();
    } catch (error) {
      return res.status(404).json({
        message: 'You are not authorized to view this content',
      });
    }
  } else {
    return res.status(403).json({
      message: 'You are not authorized to view this content',
    });
  }
};
