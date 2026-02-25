import mongoose, { Document, Schema, models } from "mongoose";

export interface ITechxploreStudent extends Document {
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  createdAt: Date;
}

const TechxploreStudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.TechxploreStudent ||
  mongoose.model<ITechxploreStudent>("TechxploreStudent", TechxploreStudentSchema);
