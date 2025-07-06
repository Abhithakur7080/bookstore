import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import ProductCard from "./ProductCard";
import type { Book } from "@/types/book";
import { Loader2 } from "lucide-react";

// Props accepted by ProductGrid
interface ProductGridProps {
  books: Book[];
  total: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
}

const PAGE_SIZE = 12;

const ProductGrid = ({
  books,
  total,
  isLoading,
  page,
  setPage,
}: ProductGridProps) => {
  // Total number of pages based on total items and items per page
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Helper to change pages
  const goToPage = (page: number) => {
    setPage(page);
  };
const handlePagePrev = () => {
  if(page > 1){
    goToPage(page - 1)
  } 
  window.scrollTo(0,0);
}
const handlePageNext = () => {
   if (page < totalPages){
    goToPage(page + 1)
  }
  window.scrollTo(0,0);
}
  return (
    <div className="space-y-6 h-screen overflow-y-auto p-4">
      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>

      // Empty Result State
      ) : books.length === 0 ? (
        <p className="text-center text-muted-foreground">No books found.</p>

      // Main Grid Rendering
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <ProductCard
                key={book._id}
                {...book} 
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="flex gap-4 items-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePagePrev}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                <PaginationItem>
                  <span className="px-2">{page}</span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={handlePageNext}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
