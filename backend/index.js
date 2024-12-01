import express from "express";
import mongoose from "mongoose";
import Coin from "./models/coin.model.js";

// Constants
const MONGODB_OPTIONS = { serverSelectionTimeoutMS: 1000 };
const MONGODB_URI = "mongodb://localhost:27017/ob-wp2-portfolio";
const PORT = 3000;

// create the express app
const app = express();

// routes

// GET http://localhost:3000/
app.get("/", (request, response) => {
  response.send("hi");
});

// GET http://localhost:3000/coins
app.get("/coins", async (request, response) => {
  const latestCoin = await Coin.findOne().sort({ timestamp: -1 }).exec();
  response.json(latestCoin);
});

// connect to MongoDB
// using promises with try/catch and await
try {
  console.log(`connecting to mongoDB on ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
  console.log("mongoDB connected");
} catch (error) {
  console.log(error);
  process.exit(1);
}

setInterval(async () => {
  // Fetch API data
  const response = await fetch("https://api.coincap.io/v2/rates/bitcoin");
  const data = await response.json();

  // Check if coin's timestamp exists
  const existingCoin = await Coin.findOne({ timestamp: data.timestamp }).exec();
  if (existingCoin) {
    console.log(`coin with existing timestamp: ${data.timestamp}; exiting...`);
    return;
  }

  // Insert API data in MongoDB
  const coin = new Coin({
    name: data.data.id,
    rateUsd: data.data.rateUsd,
    timestamp: data.timestamp,
  });
  await coin.save();
  console.log(`added new coin to db with timestamp: ${coin.timestamp}`);
}, 1000);

// start server
app.listen(PORT, () => {
  console.log(`started server on: http://localhost:${PORT}`);
});
