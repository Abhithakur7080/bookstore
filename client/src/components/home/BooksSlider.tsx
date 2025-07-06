import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import type { Book } from "@/types/book";
import { useAuth } from "@/hooks/useAuth";
import { useAddToCartMutation } from "@/services/cart.service";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Props for main slider
export interface BooksSliderProps {
  books: Book[];
  title: string;
  slogan?: string;
  loading?: boolean;
  onViewAll?: () => void;
  maxItems?: number;
}

// Props for BookImage component
interface BookImageProps {
  src: string;
  alt: string;
  loading?: boolean;
}

// Props for rating stars
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

// Default image if cover is broken
const FALLBACK_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGAtM9DsBc0dasWwmJWfolIG2AMvy33EWPxQ&s";

// Star rating UI
const StarRating: React.FC<StarRatingProps> = ({ rating, size = "sm" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={`star-${index}`}
          className={`${sizeClasses[size]} ${
            index < Math.floor(rating)
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
};

// Book cover with fallback and loading effect
const BookImage: React.FC<BookImageProps> = ({ src, alt, loading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      {(loading || !imageLoaded) && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
      <img
        src={imageError ? FALLBACK_IMAGE_URL : src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover rounded-md shadow-sm transition-all duration-300 ${
          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        loading="lazy"
      />
    </div>
  );
};

// Loader for book card while waiting
const BookCardSkeleton: React.FC = () => (
  <Card className="border-0 py-2 px-2">
    <CardHeader className="p-0 relative w-full h-80 rounded-md overflow-hidden">
      <Skeleton className="w-full h-full rounded-md" />
    </CardHeader>
    <CardContent className="pt-3 pb-4 px-2 space-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-full" />
    </CardContent>
  </Card>
);

// Each book card
const BookCard: React.FC<{
  book: Book;
  loading?: boolean;
}> = ({ book, loading = false }) => {
  const { isAuthenticated } = useAuth();
  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();
  const handleBuyClick = async () => {
    if (isAuthenticated) {
      await addToCart({ productId: book._id, quantity: 1 }).unwrap();
      navigate("/cart");
    } else {
      toast.error("You are not Logged in");
      navigate("/login");
    }
  };
  return (
    <Card  className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 py-2 px-2 bg-card">
      <CardHeader className="p-0 relative w-full h-80 flex items-center justify-center rounded-md overflow-hidden bg-muted/20">
      <Link to={`/shop/${book.slug}`}>
        <BookImage
          src={book.coverImage}
          alt={`Cover of ${book.title} by ${book.author}`}
          loading={loading}
          />
          </Link>
      </CardHeader>

      <CardContent className="pt-3 pb-4 px-2 space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-foreground line-clamp-2 h-[2.5rem] leading-tight">
            {book.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground line-clamp-1">
            by {book.author.name}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={book.ratingsAverage} size="sm" />
          <Badge variant="secondary" className="text-xs font-semibold">
            ₹{book.price}
          </Badge>
        </div>

        <Button
          onClick={handleBuyClick}
          className="w-full text-xs py-2 h-8 bg-primary hover:bg-orange-500 group-hover:bg-orange-500 cursor-pointer"
          size="sm"
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
};

// Title and view all button
const SectionHeader: React.FC<{
  title: string;
  slogan?: string;
  onViewAll?: () => void;
}> = ({ title, slogan, onViewAll }) => (
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      {slogan && <p className="text-muted-foreground text-sm">{slogan}</p>}
    </div>

    <Button
      size="sm"
      onClick={onViewAll}
      className="hidden sm:flex items-center gap-1 cursor-pointer bg-primary-foreground text-gray-900 border-1 border-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600"
    >
      View All
      <ArrowRight className="w-4 h-4" />
    </Button>
  </div>
);

// Main slider component
const BooksSlider: React.FC<BooksSliderProps> = ({
  books,
  title,
  slogan,
  loading = false,
  maxItems,
}) => {
  const displayBooks = maxItems ? books.slice(0, maxItems) : books;
  const skeletonCount = 5;
  const navigate = useNavigate();
  const handleViewAll = () => {
    const params = new URLSearchParams();

    params.set("category", "all");
    params.set("author", "all");
    params.set("rating", "0");
    params.set("price", "1000");
    params.set("page", "1");
    params.set("sort", "");

    // Optional: only do something if `title` is empty
    if (title === "New Arrivals") {
      params.set("sort", "publishedDate_desc");
    } else if (title === "Featured Books") {
      params.set("isFeatured", "true");
    } else if (title === "Popular Books") {
      params.set("sort", "popular");
    }
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <section className="py-8 w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <SectionHeader
          title={title}
          slogan={slogan}
          onViewAll={handleViewAll}
        />

        <Separator className="my-4" />

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {loading
                ? Array.from({ length: skeletonCount }, (_, index) => (
                    <CarouselItem
                      key={`skeleton-${index}`}
                      className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    >
                      <BookCardSkeleton />
                    </CarouselItem>
                  ))
                : displayBooks.map((book, index) => (
                    <CarouselItem
                      key={book._id || `book-${index}`}
                      className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    >
                      <BookCard book={book} loading={loading} />
                    </CarouselItem>
                  ))}
            </CarouselContent>

            {/* Arrows only if many items */}
            {!loading && displayBooks.length > 3 && (
              <>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </>
            )}
          </Carousel>

          {/* View all for small screens */}
        </div>

        {/* If no books */}
        {!loading && displayBooks.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                No books available at the moment.
              </p>
              <p className="text-sm text-muted-foreground">
                Check back later for new arrivals!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default BooksSlider;
