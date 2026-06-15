import mongoose, { Document, Schema, models } from "mongoose";

export interface IQuestionPaper extends Document {
  semester: string;
  title: string;
  code: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionPaperSchema: Schema = new Schema(
  {
    semester: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.QuestionPaper ||
  mongoose.model<IQuestionPaper>("QuestionPaper", QuestionPaperSchema);
