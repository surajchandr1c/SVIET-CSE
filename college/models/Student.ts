import mongoose, { Document, Schema, models } from "mongoose";

export interface IStudent extends Document {
  semester: string;
  admissionNo: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    semester: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.Student || mongoose.model<IStudent>("Student", StudentSchema);
