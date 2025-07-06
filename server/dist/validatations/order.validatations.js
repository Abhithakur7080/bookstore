"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteStripeOrderSchema = exports.CreateCheckoutSessionSchema = exports.ShippingDetailsSchema = exports.OrderItemSchema = void 0;
const zod_1 = require("zod");
const cart_validatation_1 = require("./cart.validatation");
// 👇 For each item in the order
exports.OrderItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required"),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
    price: zod_1.z.number().min(0, "Price must be 0 or more"),
    product: zod_1.z.array(cart_validatation_1.mergeCartSchema),
});
// 👇 Address and name
exports.ShippingDetailsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    address: zod_1.z.string().min(1, "Address is required"),
});
// 👇 For createCheckoutSession
exports.CreateCheckoutSessionSchema = zod_1.z.object(Object.assign({ items: cart_validatation_1.mergeCartSchema, totalAmount: zod_1.z.number().min(1, "Total must be greater than zero") }, exports.ShippingDetailsSchema.shape));
// 👇 For completeStripeOrder (sessionId comes from frontend)
exports.CompleteStripeOrderSchema = zod_1.z.object({
    sessionId: zod_1.z.string().min(1, "Session ID is required"),
});
