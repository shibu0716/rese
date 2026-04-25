import User from '../models/User.js';

export const ownerMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('role username').lean();

  if (!user || user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }

  req.owner = user;
  return next();
};
