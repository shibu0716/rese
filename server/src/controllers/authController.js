import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRequired } from '../middleware/validateRequest.js';

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const toAuthUser = (user) => ({
  id: user._id,
  username: user.username,
  balance: user.balance,
  role: user.role
});

const resolveRole = async ({ username, ownerSetupCode }) => {
  const ownerExists = await User.exists({ role: 'owner' });
  const validSetupCode = process.env.OWNER_SETUP_CODE && ownerSetupCode === process.env.OWNER_SETUP_CODE;
  const ownerUsernames = (process.env.OWNER_USERNAMES || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!ownerExists && validSetupCode) return 'owner';
  if (ownerUsernames.includes(username.toLowerCase())) return 'owner';
  return 'player';
};

export const register = async (req, res) => {
  const { username, password, ownerSetupCode } = req.body;
  if (!validateRequired(['username', 'password'], req.body)) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const role = await resolveRole({ username, ownerSetupCode });
  const user = await User.create({ username, password: hashed, role });
  return res.status(201).json({ token: signToken(user), user: toAuthUser(user) });
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

  return res.json({ token: signToken(user), user: toAuthUser(user) });
};
