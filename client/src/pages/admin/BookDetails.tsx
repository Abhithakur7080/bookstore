import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

const allCategories = [
  "Self-help",
  "Psychology",
  "Productivity",
  "Fiction",
  "Biography",
];

const dummyBook = {
  id: 1,
  title: "Atomic Habits",
  author: "James Clear",
  description:
    "Atomic Habits is a guide to building good habits and breaking bad ones...",
  image:
    "https://m.media-amazon.com/images/I/81Ls+SBCLiL._AC_UF1000,1000_QL80_.jpg",
  price: 499,
  rating: 4,
  categories: ["Self-help", "Psychology"],
};

const allAuthors = [
  "James Clear",
  "Cal Newport",
  "Stephen King",
  "Mark Manson",
  "J.K. Rowling",
];

const AdminBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(dummyBook);
  const [newCategory, setNewCategory] = useState("");

  const updateField = (field: string, value: any) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    console.log("📘 Updated Book:", book);
    // TODO: Send update to backend
  };

  const addCategory = () => {
    if (newCategory && !book.categories.includes(newCategory)) {
      updateField("categories", [...book.categories, newCategory]);
    }
    setNewCategory("");
  };

  const removeCategory = (cat: string) => {
    updateField(
      "categories",
      book.categories.filter((c) => c !== cat)
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Book</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image */}
        <Card className="p-4 flex items-center justify-center w-fit h-96">
          <img
            src={book.image}
            alt={book.title}
            className="object-contain w-full h-full rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/fallback.png";
            }}
          />
        </Card>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1">
              Title
            </Label>
            <Input
              value={book.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="author" className="mb-1">
              Author
            </Label>
            <Select
              value={book.author}
              onValueChange={(val) => updateField("author", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue  placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {allAuthors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image" className="mb-1">
              Image URL
            </Label>
            <Input
              value={book.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-1">
              Price (₹)
            </Label>
            <Input
              type="number"
              value={book.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="rating" className="mb-1">
              Rating (0–5)
            </Label>
            <Input
              type="number"
              min={0}
              max={5}
              value={book.rating}
              onChange={(e) => updateField("rating", Number(e.target.value))}
            />
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < book.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label htmlFor="categories" className="mb-1">
              Categories
            </Label>
            <div className="flex gap-2">
              <Select
                onValueChange={(val) => setNewCategory(val)}
                value={newCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories
                    .filter((cat) => !book.categories.includes(cat))
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={addCategory}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap mt-3 gap-2">
              {book.categories.map((cat) => (
                <Badge
                  key={cat}
                  className="flex items-center justify-between gap-1 bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs pr-1"
                >
                  <span className="pl-1">{cat}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-1">
              Description
            </Label>
            <Textarea
              rows={4}
              value={book.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <Button className="w-full mt-4" onClick={handleUpdate}>
            Save Changes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdminBookDetails;
