import { connectDB } from "@/lib/mongodb";
import BatchConfig from "@/models/BatchConfig";
import {
  DEFAULT_BATCH_CONFIGS,
  type BatchConfig as BatchConfigValue,
} from "@/lib/shared/batchConfig";

export type { BatchConfigValue };

export const getBatchConfigs = async (): Promise<BatchConfigValue[]> => {
  try {
    await connectDB();
    const existing = await BatchConfig.find().sort({ year: 1 }).lean();
    if (existing.length > 0) {
      const unique = new Map<string, BatchConfigValue>();
      for (const config of existing) {
        if (!unique.has(config.year)) {
          unique.set(config.year, {
            year: config.year,
            label: config.label,
            semester: config.semester,
            courseSplit: config.courseSplit,
          });
        }
      }
      return [...unique.values()];
    }

    await BatchConfig.insertMany(DEFAULT_BATCH_CONFIGS, { ordered: false });
    return DEFAULT_BATCH_CONFIGS;
  } catch {
    // Use the built-in batches when the configuration collection is unavailable.
  }

  return DEFAULT_BATCH_CONFIGS;
};
