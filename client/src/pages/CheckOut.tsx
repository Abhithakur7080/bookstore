import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, IndianRupee, TruckIcon } from "lucide-react";
import { useGetCartQuery } from "@/services/cart.service";
import {
  useCreateCheckoutSessionMutation,
  usePlaceCODOrderMutation,
} from "@/services/order.service";
import type { CartItem } from "@/types/cart";

const CheckoutForm = ({
  subtotal,
  cart,
}: {
  subtotal: number;
  cart: CartItem[];
}) => {
  const [createCheckout] = useCreateCheckoutSessionMutation();
  const [placeCODOrder] = usePlaceCODOrderMutation();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState<"cod" | "stripe">("cod");
  const [loading, setLoading] = useState(false);

  const redirectToStripeCheckout = async () => {
    const res = await createCheckout({
      items: cart,
      name,
      address,
      totalAmount: subtotal,
    }).unwrap();

    window.location.href = res.url;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (paymentType === "cod") {
        await placeCODOrder({
          items: cart,
          name,
          address,
          totalAmount: subtotal,
        }).unwrap();

        alert("Order placed with Cash on Delivery!");
        return;
      }

      if (paymentType === "stripe") {
        await redirectToStripeCheckout();
        return;
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Shipping & Payment</h2>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <div className="flex gap-4 w-full items-center">
          <Button
            className={`${
              paymentType === "cod"
                ? ""
                : "bg-white text-blue-950 hover:bg-transparent"
            } cursor-pointer`}
            onClick={() => setPaymentType("cod")}
          >
            <IndianRupee />
            Cash on Delivery
          </Button>
          <Button
            className={`${
              paymentType === "stripe"
                ? ""
                : "bg-white text-blue-950 hover:bg-transparent"
            } cursor-pointer`}
            onClick={() => setPaymentType("stripe")}
          >
            <CreditCard />
            Card / UPI
          </Button>
        </div>
      </div>

      <Separator className="my-2" />
      <div className="flex justify-between font-medium text-lg">
        <span>Total:</span>
        <span>₹{subtotal}</span>
      </div>

      <Button className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
};

const CheckoutPage = () => {
  const { data } = useGetCartQuery();
  const cart = data?.items ?? [];

  const subtotal = cart.reduce(
    (acc, item) =>
      acc + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <section className="max-w-7xl mx-auto mt-[4.5rem] px-4 py-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-2 flex gap-2 items-center">
          Order to be placed <TruckIcon />
        </h1>

        <div className="flex flex-col h-[calc(100vh-200px)] overflow-y-auto">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 p-4 border shadow-sm bg-white"
            >
              <img
                src={item.product.coverImage}
                alt={item.product.title}
                className="w-20 h-28 object-contain rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.author.name}
                </p>
                <p className="text-sm mt-1">
                  Qty: {item.quantity} × ₹
                  {item.product.discountPrice ?? item.product.price}
                </p>
                <p className="font-medium mt-1">
                  ₹
                  {item.quantity *
                    (item.product.discountPrice ?? item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CheckoutForm subtotal={subtotal} cart={cart} />
    </section>
  );
};

export default CheckoutPage;
