import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

export async function connectDB() {
  const cache = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
