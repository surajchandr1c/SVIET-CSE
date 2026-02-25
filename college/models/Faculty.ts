import mongoose, { Schema, Document, models } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  profession: string;
  image: string;
  email: string;
  experience: string;
  specialization: string;
  about: string;
  createdAt: Date;
}

const FacultySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    profession: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String, required: true },
    specialization: { type: String, required: true },
    about: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Faculty ||
  mongoose.model<IFaculty>("Faculty", FacultySchema);
