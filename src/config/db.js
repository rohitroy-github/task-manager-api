import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_DB_CONNECTION_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Running a test environemnt, no connection was made to Atlas.");
    return;
  }
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Running a production environemnt, connection was made with Atlas."
    );
    console.log("MongoDB wokring ✅");
  } catch (error) {
    console.error("MongoDB connection error 🟡", error);
    process.exit(1);
  }
};