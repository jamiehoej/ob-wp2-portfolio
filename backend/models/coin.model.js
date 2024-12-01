import mongoose from "mongoose";

const CoinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rateUsd: { type: Number, required: true },
  timestamp: { type: Number, required: true },
});

const Coin = mongoose.model("Coin", CoinSchema);

export default Coin;
