import mongoose, { Document, Schema, models } from "mongoose";

export interface IPinnedBatchProfile extends Document {
  admissionNo: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PinnedBatchProfileSchema = new Schema(
  {
    admissionNo: { type: String, required: true, trim: true, unique: true, index: true },
    order: { type: Number, required: true, min: 0, default: 0, index: true },
  },
  { timestamps: true }
);

export default models.PinnedBatchProfile ||
  mongoose.model<IPinnedBatchProfile>("PinnedBatchProfile", PinnedBatchProfileSchema);
