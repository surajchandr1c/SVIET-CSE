import mongoose, { Document, Schema, models } from "mongoose";

export type StudentRole = "student";

export interface IStudent extends Document {
  name: string;
  admissionNo: string;
  password?: string;
  semester: number;
  role: StudentRole;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, trim: true, unique: true, index: true },
    password: { type: String, required: false, select: false },
    semester: { type: Number, required: true, default: 4 },
    role: { type: String, required: true, default: "student" },
    mustChangePassword: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

// In development, Next.js HMR can keep a previously-compiled model around.
// If the schema changed (e.g. new auth fields added), Mongoose will keep using
// the old schema which can silently drop updates due to strict mode.
if (process.env.NODE_ENV === "development") {
  const existing = models.Student as mongoose.Model<IStudent> | undefined;
  const hasPasswordPath = Boolean(existing?.schema?.path("password"));
  const hasRolePath = Boolean(existing?.schema?.path("role"));
  const hasMustChangePath = Boolean(existing?.schema?.path("mustChangePassword"));
  const semesterPath = existing?.schema?.path("semester") as { instance?: string } | undefined;
  const hasNumericSemester = Boolean(semesterPath?.instance === "Number");

  if (existing && (!hasPasswordPath || !hasRolePath || !hasMustChangePath || !hasNumericSemester)) {
    delete models.Student;
  }
}

export default models.Student || mongoose.model<IStudent>("Student", StudentSchema);
