import mongoose, { Document, Schema, models } from "mongoose";

export interface IGalleryAlbum extends Document {
  heading: string;
  date: string;
  coverImageUrl: string;
  driveUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryAlbumSchema: Schema = new Schema(
  {
    heading: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    coverImageUrl: { type: String, required: true, trim: true },
    driveUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.GalleryAlbum ||
  mongoose.model<IGalleryAlbum>("GalleryAlbum", GalleryAlbumSchema);
