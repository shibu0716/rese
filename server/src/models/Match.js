import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    oddsA: { type: Number, required: true },
    oddsB: { type: Number, required: true },
    status: { type: String, enum: ['live', 'ended'], default: 'live' },
    result: { type: String, enum: ['teamA', 'teamB', null], default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Match', matchSchema);
