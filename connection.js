import dotenv from "dotenv";
import mongoose from "mongoose";

const env = dotenv.config().parsed;

export const connection = async () => {
  mongoose.connect(
    `${env.MONGODB_URI}${env.MONGODB_HOST}:${env.MONGODB_PORT}`,
    {
      // auth: { authSource: env.MONGODB_AUTH_SOURCE },
      dbName: env.MONGODB_DB_NAME,
    }
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB");
  });
};
