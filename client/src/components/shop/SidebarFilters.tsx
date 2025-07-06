import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useGetCategoriesQuery } from "@/services/category.service";
import { useGetAuthorsQuery } from "@/services/author.service";

// Predefined ratings filter
const ratings = [5, 4, 3, 2];

// Define the props for SidebarFilters
interface SidebarFiltersProps {
  category: string;
  author: string;
  price: number;
  rating: string;
  page: number;
  setCategory: (value: string) => void;
  setAuthor: (value: string) => void;
  setPrice: (value: number) => void;
  setRating: (value: string) => void;
  setPage: (value: number) => void;
}

const SidebarFilters = ({
  category,
  author,
  price,
  rating,
  setCategory,
  setAuthor,
  setPrice,
  setRating,
  setPage,
}: SidebarFiltersProps) => {
  // Fetch categories and authors from APIs
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: authorsData } = useGetAuthorsQuery();

  const categories = categoriesData?.categories ?? [];
  const authors = authorsData?.authors ?? [];

  // Control show more/less toggles for categories and authors
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [showAllAuthors, setShowAllAuthors] = useState<boolean>(false);

  // Generic handler for toggling filters (single-select behavior)
  const handleSelectToggle = (
    value: string,
    selected: string,
    setter: (val: string) => void
  ) => {
    setter(value === selected ? "" : value);
    setPage(1); // reset to first page when a filter changes
  };

  return (
    <aside className="space-y-6 md:ml-10">
      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-semibold">Categories</h3>
        <ul className="space-y-2 mt-2">
          {/* 'All' Category */}
          <li>
            <Label className="flex gap-2 items-center">
              <Checkbox
                id="category-all"
                checked={category === "all"}
                onCheckedChange={() =>
                  handleSelectToggle("all", category, setCategory)
                }
              />
              All
            </Label>
          </li>

          {/* Render top 5 or all categories */}
          {(showAllCategories ? categories : categories.slice(0, 5)).map((cat) => (
            <li key={cat._id}>
              <Label className="flex gap-2 items-center">
                <Checkbox
                  id={`cat-${cat._id}`}
                  checked={category === cat._id}
                  onCheckedChange={() =>
                    cat._id && handleSelectToggle(cat._id, category, setCategory)
                  }
                />
                {cat.name}
              </Label>
            </li>
          ))}

          {/* Show More link for categories */}
          {!showAllCategories && categories.length > 5 && (
            <li>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline mt-1"
                onClick={() => setShowAllCategories(true)}
              >
                & {categories.length - 5} more...
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Authors Section */}
      <div>
        <h3 className="text-lg font-semibold">Authors</h3>
        <ul className="space-y-2 mt-2">
          {/* 'All' Author Option */}
          <li>
            <Label className="flex gap-2 items-center">
              <Checkbox
                id="author-all"
                checked={author === "all"}
                onCheckedChange={() =>
                  handleSelectToggle("all", author, setAuthor)
                }
              />
              All
            </Label>
          </li>

          {/* Render top 5 or all authors */}
          {(showAllAuthors ? authors : authors.slice(0, 5)).map((a) => (
            <li key={a._id}>
              <Label className="flex gap-2 items-center">
                <Checkbox
                  id={`author-${a._id}`}
                  checked={author === a._id}
                  onCheckedChange={() =>
                    a._id && handleSelectToggle(a._id, author, setAuthor)
                  }
                />
                {a.name}
              </Label>
            </li>
          ))}

          {/* Show More link for authors */}
          {!showAllAuthors && authors.length > 5 && (
            <li>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline mt-1"
                onClick={() => setShowAllAuthors(true)}
              >
                & {authors.length - 5} more...
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Price Slider Section */}
      <div>
        <h3 className="text-lg font-semibold">Price Range</h3>
        <Slider
          value={[price]}
          onValueChange={([val]) => {
            setPrice(val);
            setPage(1); // reset page on price change
          }}
          max={1000}
          step={10}
          className="mt-4"
        />
        <p className="text-sm mt-1 text-muted-foreground">Up to ₹{price}</p>
      </div>

      {/* Ratings Filter Section */}
      <div>
        <h3 className="text-lg font-semibold">Ratings</h3>
        <ul className="space-y-2 mt-2">
          {ratings.map((rate) => (
            <li key={rate}>
              <Label className="flex gap-2 items-center">
                <Checkbox
                  id={`rating-${rate}`}
                  checked={rating === String(rate)}
                  onCheckedChange={() =>
                    handleSelectToggle(String(rate), rating, setRating)
                  }
                />
                {rate} Stars & Up
              </Label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarFilters;
