import mongoose, { Document, Schema, models } from "mongoose";

export interface ITechxploreStudent extends Document {
  name: string;
  position: string;
  order?: number | null;
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
    order: {
      type: Number,
      default: null,
      validate: {
        validator: (value: unknown) =>
          value === null ||
          value === undefined ||
          (typeof value === "number" &&
            Number.isFinite(value) &&
            Number.isInteger(value) &&
            value >= 1),
        message: "Order must be a whole number (>= 1) or empty.",
      },
    },
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

const MODEL_NAME = "TechxploreStudent";

if (process.env.NODE_ENV === "development") {
  const existing = models[MODEL_NAME] as mongoose.Model<ITechxploreStudent> | undefined;
  const hasOrderPath = Boolean(existing?.schema?.path("order"));
  if (existing && !hasOrderPath) {
    delete models[MODEL_NAME];
  }
}

export default (
  models[MODEL_NAME] ||
  mongoose.model<ITechxploreStudent>(MODEL_NAME, TechxploreStudentSchema)
);
