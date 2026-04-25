import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
    team: { type: String, enum: ['teamA', 'teamB'], required: true },
    amount: { type: Number, required: true, min: 1 },
    odds: { type: Number, required: true },
    status: { type: String, enum: ['open', 'won', 'lost'], default: 'open', index: true }
  },
  { timestamps: true }
);

betSchema.index({ matchId: 1, status: 1 });
betSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Bet', betSchema);
