import mongoose, { Schema } from "mongoose";

const advertisementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      min: 3,
      max: 500,
      trim: true,
    },
    targetAudience: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      trim: true,
    },
    multimediaContent: {
      image: {
        type: String,
        required: true,
        trim: true,
      },
      video: {
        type: String,
        required: true,
        trim: true,
      },
    },
    scheduling: {
      type: Date,
      required: true,
    },
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
