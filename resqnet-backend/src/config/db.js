const mongoose = require("mongoose");
let postgisClient = null;

async function connectDB() {
  if (process.env.USE_POSTGIS === "true" && process.env.POSTGIS_URI) {
    try {
      const { Client } = require("pg");
      postgisClient = new Client({
        connectionString: process.env.POSTGIS_URI,
      });
      await postgisClient.connect();
      console.log("PostGIS connected");
      return postgisClient;
    } catch (error) {
      console.error("PostGIS connection failed:", error.message);
      throw error;
    }
  }

  if (process.env.USE_MONGODB === "true" && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
      return mongoose;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      throw error;
    }
  }

  console.log("No database enabled. Using live in-memory dataset only.");
  return null;
}

module.exports = connectDB;
module.exports.getPostGISClient = () => postgisClient;
