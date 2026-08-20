import { connectDB } from "../lib/mongodb";
import BatchProfile from "../models/BatchProfile";

const main = async () => {
  await connectDB();

  const profiles = await BatchProfile.find({})
    .select("admissionNo batch")
    .lean<Array<{ admissionNo?: string; batch?: string }>>();
  const operations = profiles.flatMap((profile) => {
    const year = profile.admissionNo?.match(/^(20\d{2})/i)?.[1];
    if (year !== "2024" && year !== "2025") return [];
    const batch = `${year} Batch`;
    if (profile.batch === batch) return [];

    return [
      {
        updateOne: {
          filter: { admissionNo: profile.admissionNo },
          update: { $set: { batch } },
        },
      },
    ];
  });

  if (operations.length > 0) {
    await BatchProfile.bulkWrite(operations, { ordered: false });
  }

  const counts = {
    "2024 Batch": await BatchProfile.countDocuments({ batch: "2024 Batch" }),
    "2025 Batch": await BatchProfile.countDocuments({ batch: "2025 Batch" }),
  };

  console.log(`Updated ${operations.length} portfolio profiles.`);
  console.log(counts);
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
