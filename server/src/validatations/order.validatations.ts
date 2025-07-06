import { z } from "zod";
import { mergeCartSchema, MergeCart } from './cart.validatation';

// 👇 For each item in the order
export const OrderItemSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be 0 or more"),
  product: z.array(mergeCartSchema), 
});

// 👇 Address and name
export const ShippingDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

// 👇 For createCheckoutSession
export const CreateCheckoutSessionSchema = z.object({
  items: mergeCartSchema,
  totalAmount: z.number().min(1, "Total must be greater than zero"),
  ...ShippingDetailsSchema.shape,
});

// 👇 For completeStripeOrder (sessionId comes from frontend)
export const CompleteStripeOrderSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});
