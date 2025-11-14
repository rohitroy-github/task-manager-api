import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  if (process.env.NODE_ENV === "test") return;

  if (mongoose.connection.readyState !== 0) return;

  try {
    const uri = process.env.MONGO_DB_CONNECTION_URI;
    if (!uri) throw new Error("MONGO_DB_CONNECTION_URI is not defined in .env");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      deprecationErrors: true,
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
};

// // Code snippet taken from Atlas cluster dashboard
// import dotenv from "dotenv";
// import { MongoClient, ServerApiVersion } from "mongodb";

// dotenv.config();

// const uri = process.env.MONGO_DB_CONNECTION_URI;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// export const connectDB = async () => {
//     console.log("connectDB() called, env:", process.env.NODE_ENV);


//   if (process.env.NODE_ENV === "test") {
//     console.log("Running a test environemnt");
//     return;
//   }
//   try {
//     await client.connect();

//         console.log("Client connected…");


//     await client.db("admin").command({ ping: 1 });

//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };
