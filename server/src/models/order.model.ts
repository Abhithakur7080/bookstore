import mongoose, { Schema, Model } from "mongoose";
import { IOrder } from "../types/order";


const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: {
      name: String,
      address: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered"],
      default: "placed",
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
