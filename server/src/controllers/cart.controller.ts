import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Book from "../models/book.model";
import { StatusCode } from "../utils/statusCodes";
import {
  addToCartSchema,
  cartItemParamSchema,
  mergeCartSchema,
} from "../validatations/cart.validatation";

class CartController {
  public getCart = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.id).populate({
        path: "cart.productId",
        model: Book,
      });

      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      const items = user.cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        addedAt: item.addedAt,
      }));

      return res.status(StatusCode.OK).json({ items, message: "User Cart Fetched" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to fetch cart",
        error,
      });
    }
  };
  public mergeCart = async (req: Request, res: Response) => {
    const result = mergeCartSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      const guestItems = result.data || [];

      guestItems.forEach((incomingItem) => {
        const existingIndex = user.cart.findIndex((item) =>
          item.productId.equals(incomingItem.product._id)
        );

        if (existingIndex !== -1) {
          user.cart[existingIndex].quantity += incomingItem.quantity;
        } else {
          user.cart.push({
            productId: new mongoose.Types.ObjectId(incomingItem.product._id),
            quantity: incomingItem.quantity,
            addedAt: new Date(),
          });
        }
      });

      await user.save();
      return res.status(StatusCode.OK).json({ message: "User & Local cart merged" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to merge cart",
        error,
      });
    }
  };

  public addToCart = async (req: Request, res: Response) => {
    const result = addToCartSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      console.log(errors)
      return res.status(StatusCode.BadRequest).json({ errors });
    }
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      const { productId, quantity } = result.data;
      if (!productId || quantity < 1) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Invalid product or quantity" });
      }

      const index = user.cart.findIndex((item) =>
        item.productId.equals(productId)
      );

      if (index >= 0) {
        user.cart[index].quantity = quantity;
      } else {
        user.cart.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity,
          addedAt: new Date(),
        });
      }

      await user.save();
      return res.status(StatusCode.OK).json({ message: "Item added to cart" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to add to cart",
        error,
      });
    }
  };

  public removeFromCart = async (req: Request, res: Response) => {
    try {
      const paramCheck = cartItemParamSchema.safeParse(req.params);
      if (!paramCheck.success) {
        return res.status(StatusCode.BadRequest).json({
          errors: paramCheck.error.flatten().fieldErrors,
        });
      }
      const { productId } = paramCheck.data;

      const user = await User.findById(req.user?.id);
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      user.cart = user.cart.filter((item) => !item.productId.equals(productId));

      await user.save();
      return res.status(StatusCode.OK).json({ message: "Item removed from cart" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to remove item from cart",
        error,
      });
    }
  };
  public increaseQuantity = async (req: Request, res: Response) => {
  try {
    const paramCheck = cartItemParamSchema.safeParse(req.params);
      if (!paramCheck.success) {
        return res.status(StatusCode.BadRequest).json({
          errors: paramCheck.error.flatten().fieldErrors,
        });
      }
      const { productId } = paramCheck.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCode.BadRequest).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(StatusCode.NotFound).json({ message: "User not found" });
    }

    const index = user.cart.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (index === -1) {
      return res.status(StatusCode.NotFound).json({ message: "Product not in cart" });
    }

    user.cart[index].quantity += 1;
    await user.save();

    return res.status(StatusCode.OK).json({ message: "Quantity increased" });
  } catch (error) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Failed to increase quantity",
      error,
    });
  }
};

public decreaseQuantity = async (req: Request, res: Response) => {
  try {
   const paramCheck = cartItemParamSchema.safeParse(req.params);
      if (!paramCheck.success) {
        return res.status(StatusCode.BadRequest).json({
          errors: paramCheck.error.flatten().fieldErrors,
        });
      }
      const { productId } = paramCheck.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCode.BadRequest).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(StatusCode.NotFound).json({ message: "User not found" });
    }

    const index = user.cart.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (index === -1) {
      return res.status(StatusCode.NotFound).json({ message: "Product not in cart" });
    }

    if (user.cart[index].quantity > 1) {
      user.cart[index].quantity -= 1;
    } else {
      // Optional: remove item if quantity reaches 0
      user.cart.splice(index, 1);
    }

    await user.save();

    return res.status(StatusCode.OK).json({ message: "Quantity decreased" });
  } catch (error) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Failed to decrease quantity",
      error,
    });
  }
};


  public clearCart = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      user.cart = [];
      await user.save();

      return res.status(StatusCode.OK).json({ message: "Cart cleared successfully" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({
        message: "Failed to clear cart",
        error,
      });
    }
  };
}

export default new CartController();
