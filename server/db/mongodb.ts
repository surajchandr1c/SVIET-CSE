import { promises as dns } from "node:dns";
import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const DEFAULT_CONNECT_OPTIONS = {
  family: 4 as const,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 20000,
};

const hasSrvQueryFailure = (message: string) =>
  message.includes("querySrv") && message.includes("ECONNREFUSED");

const buildDirectMongoUriFromSrv = async (mongodbUri: string) => {
  const parsed = new URL(mongodbUri);

  if (parsed.protocol !== "mongodb+srv:") {
    return mongodbUri;
  }

  const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${parsed.hostname}`);
  if (srvRecords.length === 0) {
    throw new Error(`No SRV records found for ${parsed.hostname}.`);
  }

  const hosts = srvRecords
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((record) => `${record.name}:${record.port}`)
    .join(",");

  const searchParams = new URLSearchParams(parsed.search);
  searchParams.set("tls", "true");

  try {
    const txtRecords = await dns.resolveTxt(parsed.hostname);
    const txtValue = txtRecords.flat().join("");
    if (txtValue) {
      const txtParams = new URLSearchParams(txtValue);
      txtParams.forEach((value, key) => {
        if (!searchParams.has(key)) {
          searchParams.set(key, value);
        }
      });
    }
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";

    if (code !== "ENODATA" && code !== "ENOTFOUND") {
      throw error;
    }
  }

  const pathname = parsed.pathname === "/" ? "" : parsed.pathname;
  const auth =
    parsed.username || parsed.password
      ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@`
      : "";

  const query = searchParams.toString();
  return `mongodb://${auth}${hosts}${pathname}${query ? `?${query}` : ""}`;
};

export async function connectDB() {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const cache = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongodbUri, DEFAULT_CONNECT_OPTIONS)
      .catch(async (error) => {
        const message =
          error instanceof Error ? error.message : "Unknown MongoDB connection error.";

        if (!hasSrvQueryFailure(message)) {
          throw error;
        }

        const fallbackUri =
          process.env.MONGODB_URI_DIRECT ?? (await buildDirectMongoUriFromSrv(mongodbUri));

        return mongoose.connect(fallbackUri, DEFAULT_CONNECT_OPTIONS);
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;

    const message =
      error instanceof Error ? error.message : "Unknown MongoDB connection error.";

    if (message.includes("ETIMEDOUT") || message.includes("Server selection timed out")) {
      throw new Error(
        "MongoDB connection timed out. Check Atlas network access, internet connectivity, and the MONGODB_URI. IPv4 is now forced to avoid IPv6 timeout paths."
      );
    }

    if (hasSrvQueryFailure(message)) {
      throw new Error(
        "MongoDB SRV DNS lookup failed. The app retried with a direct cluster URI; if this still fails, set MONGODB_URI_DIRECT in .env.local using the Atlas host list."
      );
    }

    throw error;
  }
}
