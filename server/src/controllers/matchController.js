import Match from '../models/Match.js';

export const listMatches = async (req, res) => {
  const matches = await Match.find().sort({ createdAt: -1 });
  res.json(matches);
};
