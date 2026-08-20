import mongoose, { Document, Schema, models } from "mongoose";

export interface IBatchConfig extends Document {
  year: string;
  label: string;
  semester: number;
  courseSplit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchConfigSchema = new Schema<IBatchConfig>(
  {
    year: { type: String, required: true, trim: true, unique: true, index: true },
    label: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1 },
    courseSplit: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.BatchConfig || mongoose.model<IBatchConfig>("BatchConfig", BatchConfigSchema);
