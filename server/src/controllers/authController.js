import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRequired } from '../middleware/validateRequest.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!validateRequired(['username', 'password'], req.body)) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  return res.status(201).json({ token: signToken(user._id), user: { id: user._id, username: user.username, balance: user.balance } });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!validateRequired(['username', 'password'], req.body)) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({ token: signToken(user._id), user: { id: user._id, username: user.username, balance: user.balance } });
};
