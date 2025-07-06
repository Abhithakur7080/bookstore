import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { StatusCode } from "../utils/statusCodes";
import Order from "../models/order.model";
import User from "../models/user.model";
import { serverConfig } from "../config";
import { extractZodErrors } from "../utils/zodErrorHelper";
import { MergeCart } from "../validatations/cart.validatation";
import {
  CompleteStripeOrderSchema,
  CreateCheckoutSessionSchema,
} from "../validatations/order.validatations";

class OrderController {
  /**
   * Create Stripe checkout session
   */
  public createCheckoutSession = async (req: Request, res: Response) => {
    try {
      const result = CreateCheckoutSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ errors: extractZodErrors(result.error.errors) });
      }

      const { items, name, address, totalAmount } = result.data;
      const userId = req.user.id;

      const line_items = items.map((item: any) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.name || item.product.title || "Product",
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: `${serverConfig.frontendUrl}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${serverConfig.frontendUrl}/payment?success=false&cancelled=true`,
        customer_email: req.user.email,
        metadata: {
          userId,
          name,
          address,
          totalAmount: totalAmount.toString(),
          items: JSON.stringify(
            items.map((item: any) => ({
              productId: item.product._id || item.product.id,
              name: item.product.name || item.product.title || "Product",
              price: item.product.price,
              quantity: item.quantity,
            }))
          ).slice(0, 490),
        },
      });

      return res.status(StatusCode.OK).json({ url: session.url });
    } catch (error) {
      console.error("Checkout Session Error:", error);
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to create checkout session",
        error,
      });
    }
  };

  /**
   * Complete Stripe payment and save order
   */
  public completeStripeOrder = async (req: Request, res: Response) => {
    try {
      const result = CompleteStripeOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ errors: extractZodErrors(result.error.errors) });
      }

      const { sessionId } = result.data;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const {
        userId,
        name,
        address,
        items,
        totalAmount,
      }: {
        userId: string;
        name: string;
        address: string;
        items: string;
        totalAmount: string;
      } = session.metadata as any;

      const parsedItems = JSON.parse(items);

      // Transform parsed items to match the expected format
      const transformedItems = parsedItems.map((item: any) => ({
        product: {
          _id: item.productId,
          name: item.name,
          price: item.price,
        },
        quantity: item.quantity,
      }));

      const order = await this.createOrder({
        userId,
        items: transformedItems,
        name,
        address,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: "stripe",
        paymentStatus: "paid",
        stripeSessionId: sessionId,
      });

      await this.clearUserCart(userId, String(order._id));

      return res.status(StatusCode.Created).json({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      console.error("Complete Stripe Order Error:", error);
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to complete Stripe order",
        error,
      });
    }
  };

  /**
   * Place Cash on Delivery order
   */
  public placeCODOrder = async (req: Request, res: Response) => {
    try {
      const result = CreateCheckoutSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ errors: extractZodErrors(result.error.errors) });
      }

      const { items, name, address, totalAmount } = result.data;
      const userId = req.user.id;

      const order = await this.createOrder({
        userId,
        items,
        name,
        address,
        totalAmount,
        paymentMethod: "cod",
        paymentStatus: "pending",
      });

      await this.clearUserCart(userId, String(order._id));

      return res.status(StatusCode.Created).json({
        message: "Order placed with Cash on Delivery",
        order,
      });
    } catch (error) {
      console.error("COD Order Error:", error);
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to place COD order",
        error,
      });
    }
  };

  /**
   * 🔒 Private method to create an order
   */
  private async createOrder({
    userId,
    items,
    name,
    address,
    totalAmount,
    paymentMethod,
    paymentStatus,
    stripeSessionId,
  }: {
    userId: string;
    items: MergeCart;
    name: string;
    address: string;
    totalAmount: number;
    paymentMethod: "cod" | "stripe";
    paymentStatus: "pending" | "paid";
    stripeSessionId?: string;
  }) {
    return await Order.create({
      user: userId,
      items: items.map((item) => ({
        product: item.product?._id || item.product?.id || "000000000000000000000000",
        quantity: item.quantity,
        price: item.product?.price || 0,
      })),
      shippingAddress: { name, address },
      paymentMethod,
      paymentStatus,
      totalAmount,
      status: "placed",
      stripeSessionId,
    });
  }

  /**
   * 🔒 Private method to clear user's cart
   */
  private async clearUserCart(userId: string, orderId: string) {
    await User.findByIdAndUpdate(userId, {
      $push: { orders: orderId },
      $set: { cart: [] },
    });
  }
  /**
 * Get orders of the logged-in user
 */
public getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(StatusCode.OK).json({ orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(StatusCode.InternalServerError).json({
      message: "Failed to fetch user orders",
      error,
    });
  }
};
/**
 * Admin: Update order status
 */
public updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(StatusCode.BadRequest).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.product");

    if (!order) {
      return res.status(StatusCode.NotFound).json({ message: "Order not found" });
    }

    return res.status(StatusCode.OK).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(StatusCode.InternalServerError).json({
      message: "Failed to update order status",
      error,
    });
  }
};

}

export default new OrderController();