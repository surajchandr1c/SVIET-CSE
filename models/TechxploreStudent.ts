import mongoose, { Document, Schema, models } from "mongoose";

export interface ITechxploreStudent extends Document {
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  about: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
}

const TechxploreStudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    instagram: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default models.TechxploreStudent ||
  mongoose.model<ITechxploreStudent>("TechxploreStudent", TechxploreStudentSchema);
