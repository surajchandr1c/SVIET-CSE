import mongoose, { Document, Schema, models } from "mongoose";

export interface IStudyResource extends Document {
  semester: string;
  category: "assignment" | "notes" | "ppt";
  title: string;
  code: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudyResourceSchema: Schema = new Schema(
  {
    semester: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["assignment", "notes", "ppt"],
    },
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.StudyResource ||
  mongoose.model<IStudyResource>("StudyResource", StudyResourceSchema);
