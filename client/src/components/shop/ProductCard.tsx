import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCartMutation } from "@/services/cart.service";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import type { Book } from "@/types/book";
import type { CartItem } from "@/types/cart";
import { useDispatch } from "react-redux";
import { addToCart as addToGuestCart } from "@/features/cartSlice";
import { Link } from "react-router-dom";

const ProductCard = ({
  _id,
  slug,
  title,
  coverImage,
  author,
  price,
  ratingsAverage,
  ...rest
}: Book) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      const cartItem: CartItem = {
        addedAt: new Date().toISOString(),
        product: {
          _id,
          title,
          coverImage,
          author,
          price,
          ratingsAverage,
          slug,
          ...rest,
        },
        quantity: 1,
      };

      if (isAuthenticated) {
        await addToCart({ productId: _id, quantity: 1 }).unwrap();
      } else {
        dispatch(addToGuestCart(cartItem));
        window.dispatchEvent(new Event("guestCartUpdated"));
      }

      toast.success(`"${title}" added successfully.`);
    } catch (error) {
      if(error instanceof Error) {
        toast.error("Failed to add to cart.");
      }
    }
  };

  return (
    <Card className="group shadow-md hover:shadow-xl transition p-4">
      <CardHeader className="p-0">
        <Link to={`/shop/${slug}`}>
        <img
          src={coverImage}
          alt={title}
          className="w-full h-60 object-contain p-2"
          />
          </Link>
      </CardHeader>

      <CardContent className="px-3 py-2 space-y-2">
        <CardTitle className="text-base font-semibold line-clamp-2 min-h-[3rem]">
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">by {author.name}</p>
        <p className="text-sm font-semibold mt-1">₹{price}</p>

        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          {Array(Math.floor(ratingsAverage ?? 0))
            .fill(null)
            .map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400" />
            ))}
        </div>

        <div className="flex gap-2 pt-2 justify-center">
          <Button
          size={"sm"}
            className="text-xs flex-1  hover:bg-orange-800 flex gap-1 items-center  cursor-pointer"
            onClick={handleAddToCart}
          >
            <ShoppingBasket className="w-4 h-4" />
            Add to Cart
          </Button>

          <Link to={`/shop/${slug}`}>
            <Button
            size={"sm"}
              className="bg-amber-600 flex-1 hover:bg-amber-400 text-xs flex gap-1 items-center cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
