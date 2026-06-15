import mongoose, { Schema, Document, models } from "mongoose";

export interface INotice extends Document {
  heading: string;
  date: string;
  driveUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    driveUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
