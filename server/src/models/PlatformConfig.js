import mongoose from 'mongoose';

const gameRatesSchema = new mongoose.Schema(
  {
    coinFlip: { type: Number, default: 2, min: 1, max: 20 },
    dice: { type: Number, default: 5, min: 1, max: 50 },
    crashMaxMultiplier: { type: Number, default: 6, min: 1.1, max: 100 }
  },
  { _id: false }
);

const limitsSchema = new mongoose.Schema(
  {
    minStake: { type: Number, default: 1, min: 1 },
    maxStake: { type: Number, default: 500, min: 1 },
    apiRateLimitPerMinute: { type: Number, default: 600, min: 60, max: 5000 },
    socketUpdateMs: { type: Number, default: 3000, min: 1000, max: 30000 },
    targetConcurrentUsers: { type: Number, default: 1000, min: 1 }
  },
  { _id: false }
);

const scoreWeightsSchema = new mongoose.Schema(
  {
    walletLiquidity: { type: Number, default: 30, min: 0, max: 100 },
    openBets: { type: Number, default: 25, min: 0, max: 100 },
    recentVolume: { type: Number, default: 25, min: 0, max: 100 },
    activeUsers: { type: Number, default: 20, min: 0, max: 100 }
  },
  { _id: false }
);

const platformConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true, immutable: true },
    gameRates: { type: gameRatesSchema, default: () => ({}) },
    limits: { type: limitsSchema, default: () => ({}) },
    scoreWeights: { type: scoreWeightsSchema, default: () => ({}) },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

platformConfigSchema.statics.getConfig = async function getConfig() {
  const config = await this.findOne({ key: 'default' });
  if (config) return config;
  return this.create({ key: 'default' });
};

export default mongoose.model('PlatformConfig', platformConfigSchema);
