import { useNavigate, useParams } from "react-router-dom";
import { useGetBookQuery } from "@/services/book.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types/category";
import type { CartItem } from "@/types/cart";
import { useAuth } from "@/hooks/useAuth";
import type { Book } from "@/types/book";
import { useAddToCartMutation } from "@/services/cart.service";
import { useDispatch } from "react-redux";
import { addToCart as addToGuestCart } from "@/features/cartSlice";
import toast from "react-hot-toast";

const BookDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useGetBookQuery(slug);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const book: Book = data?.book;
  // Handle undefined slug
  if (!slug) {
    return (
      <section className="min-h-[60vh] flex justify-center items-center">
        <p className="text-muted-foreground">❌ Invalid book link.</p>
      </section>
    );
  }
  
  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10 mt-[4.5rem]">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !book) {
    return (
      <section className="min-h-[60vh] flex justify-center items-center">
        <p className="text-muted-foreground">
          ❌ Book not found in the database.
        </p>
      </section>
    );
  }
  
  const handleAddToCart = async () => {
    try {
      const cartItem: CartItem = {
        addedAt: new Date().toISOString(),
        product: book,
        quantity: 1,
      };

      if (isAuthenticated) {
        await addToCart({ productId: book._id, quantity: 1 }).unwrap();
      } else {
        dispatch(addToGuestCart(cartItem));
        window.dispatchEvent(new Event("guestCartUpdated"));
      }

      toast.success(`"${book.title}" added successfully.`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to add to cart.");
      }
    }
  };
  const handleBuyNow = async () => {
    if (isAuthenticated) {
      await addToCart({ productId: book._id, quantity: 1 }).unwrap();
      navigate("/cart");
    } else {
      toast.error("You are not Logged in");
      navigate("/login");
    }
  };
  return (
    <section className="max-w-5xl mx-auto px-4 py-10 mt-[4.5rem] space-y-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Book Cover */}
        <Card className="p-6 w-fit h-full flex justify-center items-center">
          <img
            src={book.coverImage}
            alt={book.title}
            className="object-contain max-h-96 rounded"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/fallback.png")
            }
          />
        </Card>

        {/* Book Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-muted-foreground text-sm">by {book.author.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < book.ratingsAverage
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {book.ratingsAverage}/5
            </span>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-green-600">₹{book.price}</p>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {book.stock} items available in stock
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-orange-500 rounded-sm"
              onClick={handleAddToCart}
            >
              Add to Cart <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
            <Button
              className="bg-green-700 text-white rounded-sm"
              onClick={handleBuyNow}
            >
              Buy Now <Zap className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {book.categories.map((cat: Category) => (
              <Badge key={cat._id} className="text-xs">
                {cat.name}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <h2 className="font-medium text-lg">About this book</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetailsPage;
