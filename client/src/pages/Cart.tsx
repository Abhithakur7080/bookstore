import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowRight, Plus, Minus, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  useClearCartMutation,
  useDecreaseCartItemMutation,
  useIncreaseCartItemMutation,
  useRemoveFromCartMutation,
} from "@/services/cart.service";

const CartPage = () => {
  // Auth & Cart states
  const { isAuthenticated } = useAuth();
  const { carts, refetchCart, clearCartAction, replaceCartAction } = useCart();

  // RTK Query mutations
  const [clearCartMutation] = useClearCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [increaseItemFromCart] = useIncreaseCartItemMutation();
  const [decreaseItemFromCart] = useDecreaseCartItemMutation();

  const navigate = useNavigate();

  // Handle cart quantity change (manual input or +/-)
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const currentItem = carts.find((item) => item.product._id === id);
    if (!currentItem) return;

    if (isAuthenticated) {
      try {
        if (newQuantity > currentItem.quantity) {
          await increaseItemFromCart(id).unwrap();
        } else if (newQuantity < currentItem.quantity) {
          await decreaseItemFromCart(id).unwrap();
        }
        await refetchCart(); // refresh cart after update
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    } else {
      // Local cart update for guest users
      const updated = carts.map((item) =>
        item.product._id === id ? { ...item, quantity: newQuantity } : item
      );
      replaceCartAction(updated);
    }
  };

  // Remove a single item from cart
  const handleRemove = async (id: string) => {
    const updated = carts.filter((item) => item.product._id !== id);
    if (isAuthenticated) {
      await removeFromCart(id).unwrap();
    } else {
      replaceCartAction(updated);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (isAuthenticated) {
      await clearCartMutation().unwrap();
      await refetchCart();
    } else {
      clearCartAction();
    }
  };

  // Price calculations
  const subtotal = carts.reduce(
    (acc, item) =>
      acc + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handleCheckout = () => {
      navigate("/checkout")
  }

  // Empty cart UI
  if (carts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
        <h2 className="text-lg font-medium">Your cart is empty</h2>
        <Link to="/shop">
          <Button type="button" className="mt-4 bg-primary text-white">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-[4.5rem]">
      {/* Cart header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleClearCart}
          className="text-xs"
        >
          Clear Cart
        </Button>
      </div>

      {/* Cart and Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Cart Items Section */}
        <div className="space-y-4">
          {carts.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 items-center p-4 border rounded-lg bg-white shadow-sm"
            >
              {/* Product Image */}
              <img
                src={item.product.coverImage}
                alt={item.product.title}
                className="w-24 h-32 object-contain rounded"
              />

              {/* Product Details */}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-lg">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {item.product.author.name}
                </p>
                <p className="text-sm font-medium">
                  ₹{item.product.discountPrice ?? item.product.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  {/* Decrease button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  {/* Quantity input with arrows hidden */}
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product._id,
                        Number(e.target.value)
                      )
                    }
                    className="w-14 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                    min={1}
                  />

                  {/* Increase button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.product._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="border rounded-lg p-6 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <Separator className="mb-4" />
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <Separator className="mb-4" />
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <Button type="button" className="w-full" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
