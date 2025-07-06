import { Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    name: string;
    address: string;
  };
  paymentMethod: "cod" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";
  totalAmount: number;
  status: "placed" | "processing" | "shipped" | "delivered";
  stripeSessionId?: string;
}
