const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');

// No authUser

// authOwner for owner routes
exports.authOwner = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'owner') {
      return res.status(403).json({ message: 'Not authorized as owner' });
    }
    req.owner = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
