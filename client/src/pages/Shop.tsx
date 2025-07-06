import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import { useGetBooksQuery } from "@/services/book.service";
import { useDebouncedSearchParams } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useDebouncedSearchParams("search", 1000);

  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [author, setAuthor] = useState<string>(
    searchParams.get("author") || "all"
  );
  const [price, setPrice] = useState<number>(
    Number(searchParams.get("price") || "1000")
  );
  const [rating, setRating] = useState<string>(
    searchParams.get("rating") || "0"
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page") || "1")
  );

  // Optional filters: only apply if present
  const sort = searchParams.get("sort") || "";
  const isFeatured = searchParams.get("isFeatured") === "true";

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set("search", query.trim());
    params.set("category", category);
    params.set("author", author);
    params.set("rating", rating);
    params.set("price", String(price));
    params.set("page", String(page));

    if (sort) params.set("sort", sort);
    if (isFeatured) params.set("isFeatured", "true");

    setSearchParams(params, { replace: true });
  }, [
    query,
    category,
    author,
    price,
    rating,
    page,
    sort,
    isFeatured,
    setSearchParams,
  ]);

  // Build API params conditionally
  const queryParams: any = {
    page,
    limit: PAGE_SIZE,
    search: query,
    category,
    author,
    price,
    rating,
  };

  if (sort) queryParams.sort = sort;
  if (isFeatured) queryParams.isFeatured = true;

  const { data, isLoading } = useGetBooksQuery(queryParams);

  const books = data?.books ?? [];
  const total = data?.total ?? 0;

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <section className="px-4 mt-[4.5rem] py-10 space-y-6">
      {/* Search Bar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 max-w-96 mx-auto">
        <Input
          placeholder="Search books by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
      </div>

      {/* Main Grid: Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <SidebarFilters
          category={category}
          author={author}
          price={price}
          rating={rating}
          page={page}
          setCategory={setCategory}
          setAuthor={setAuthor}
          setPrice={setPrice}
          setRating={setRating}
          setPage={setPage}
        />

        <ProductGrid
          books={books}
          total={total}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
        />
      </div>
    </section>
  );
};

export default ShopPage;
