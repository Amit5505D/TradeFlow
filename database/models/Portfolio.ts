import mongoose, { Schema, models, model } from "mongoose";

const PortfolioSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Portfolio =
  models.Portfolio || model("Portfolio", PortfolioSchema);
