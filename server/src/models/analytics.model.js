import mongoose, { Schema } from "mongoose";

const analyticsSchema = new Schema(
  {
    advertisement: {
      type: Schema.Types.ObjectId,
      ref: "Advertisement",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
