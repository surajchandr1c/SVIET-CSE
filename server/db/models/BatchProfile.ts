import mongoose, { Document, Schema, models } from "mongoose";

export interface IBatchProfile extends Document {
  studentId?: mongoose.Types.ObjectId | null;
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  course: string;
  about: string;
  keywords?: string;
  skills: Array<
    string | { title: string; items: string[] }
  >;
  projects: Array<{
    title: string;
    description?: string;
    link?: string;
  }>;
  certificates: Array<{
    title: string;
    date?: string;
    previewImage?: string;
    link?: string;
  }>;
  achievements: Array<{
    title: string;
    description?: string;
    previewImage?: string;
    link?: string;
    date?: string;
  }>;
  isDisabled?: boolean;
  instagram?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BatchProfileSchema: Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true, default: "Student" },
    image: { type: String, required: true, trim: true, default: "/no-image.png" },
    admissionNo: { type: String, required: true, trim: true, unique: true, index: true },
    batch: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true, default: "B.Tech CSE" },
    about: { type: String, required: true, trim: true, default: "" },
    keywords: { type: String, trim: true, default: "" },
    skills: { type: [Schema.Types.Mixed], default: [] },
    projects: { type: [Schema.Types.Mixed], default: [] },
    certificates: { type: [Schema.Types.Mixed], default: [] },
    achievements: { type: [Schema.Types.Mixed], default: [] },
    isDisabled: { type: Boolean, default: false, index: true },
    instagram: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default models.BatchProfile ||
  mongoose.model<IBatchProfile>("BatchProfile", BatchProfileSchema);
