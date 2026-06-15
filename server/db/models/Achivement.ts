import mongoose, { Document, Schema, models } from "mongoose";

export interface IAchivement extends Document {
  heading: string;
  date: string;
  coverImageUrl: string;
  driveUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchivementSchema: Schema = new Schema(
  {
    heading: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    coverImageUrl: { type: String, required: true, trim: true },
    driveUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.Achivement ||
  mongoose.model<IAchivement>("Achivement", AchivementSchema);
