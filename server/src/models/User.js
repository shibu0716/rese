import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true },
    balance: { type: Number, default: 1000, min: 0 },
    role: { type: String, enum: ['player', 'owner'], default: 'player', index: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ balance: -1 });

export default mongoose.model('User', userSchema);
