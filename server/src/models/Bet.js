import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    team: { type: String, enum: ['teamA', 'teamB'], required: true },
    amount: { type: Number, required: true, min: 1 },
    odds: { type: Number, required: true },
    status: { type: String, enum: ['open', 'won', 'lost'], default: 'open' }
  },
  { timestamps: true }
);

export default mongoose.model('Bet', betSchema);
