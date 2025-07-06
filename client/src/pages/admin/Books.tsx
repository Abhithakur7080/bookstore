import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Users,
  Grid,
  List,
  Star,
  Package,
  BookCopy,
} from "lucide-react";
import type { Book, BookCreateInput } from "@/types/book";
import type { Category } from "@/types/category";
import type { Author } from "@/types/author";
import { useGetCategoriesQuery } from "@/services/category.service";
import { useGetAuthorsQuery } from "@/services/author.service";
import { useGetBooksQuery } from "@/services/book.service";

const PAGE_SIZE = 8;



// Filter Component
const FilterSection: React.FC<{
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  authorFilter: string;
  setAuthorFilter: (value: string) => void;
  resetFilters: () => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  categories: Category[];
  authors: Author[];
}> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  authorFilter,
  setAuthorFilter,
  resetFilters,
  viewMode,
  setViewMode,
  categories,
  authors,
}) => (
  <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search books, authors, or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id || ""}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={authorFilter} onValueChange={setAuthorFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Author" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author._id} value={author._id || ""}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={resetFilters}>
        <Filter className="w-4 h-4 mr-2" />
        Reset
      </Button>

      <div className="flex bg-gray-100 rounded-md p-1">
        <Button
          size="sm"
          variant={viewMode === "table" ? "default" : "ghost"}
          onClick={() => setViewMode("table")}
          className="px-3"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewMode === "grid" ? "default" : "ghost"}
          onClick={() => setViewMode("grid")}
          className="px-3"
        >
          <Grid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

// Table View Component
const TableView: React.FC<{
  books: Book[];
  isLoading: boolean;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}> = ({ books, isLoading, handleEdit, handleDelete }) => (
  <Card className="pt-0 overflow-hidden">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <TableHead className="text-white font-medium">Cover</TableHead>
              <TableHead className="text-white font-medium">Title</TableHead>
              <TableHead className="text-white font-medium">Author</TableHead>
              <TableHead className="text-white font-medium">Categories</TableHead>
              <TableHead className="text-white font-medium">Publisher</TableHead>
              <TableHead className="text-white font-medium">ISBN</TableHead>
              <TableHead className="text-white font-medium">Stock</TableHead>
              <TableHead className="text-white font-medium">Published</TableHead>
              <TableHead className="text-white font-medium">Pages</TableHead>
              <TableHead className="text-white font-medium">Price</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading books...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <BookOpen className="w-12 h-12 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No books found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters, or add your first book
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book._id} className="hover:bg-gray-50">
                  <TableCell>
                    <img
                      src={book.coverImage || "https://via.placeholder.com/200x300?text=No+Image"}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/200x300?text=No+Image";
                      }}
                    />
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left max-w-40 text-wrap"
                        onClick={() => handleEdit(book._id)}
                      >
                        {book.title}
                      </button>
                      {book.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{book.author?.name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {book.categories?.map((cat) => (
                        <Badge key={cat._id} variant="secondary" className="text-xs">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{book.publisher || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">{book.ISBN || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        book.stock > 20
                          ? "default"
                          : book.stock > 5
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {book.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{book.pages}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">₹{book.price}</span>
                      {book.discountPrice && (
                        <span className="text-sm text-green-600">
                          ₹{book.discountPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.isFeatured ? "default" : "secondary"}>
                      {book.isFeatured ? "Featured" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(book._id)}
                        className="hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(book._id)}
                        className="hover:bg-red-50 text-red-600 border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

// Grid View Component
const GridView: React.FC<{
  books: Book[];
  isLoading: boolean;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}> = ({ books, isLoading, handleEdit, handleDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {isLoading ? (
      Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : books.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium text-gray-500">No books found</p>
        <p className="text-sm text-gray-400">
          Try adjusting your search or filters, or add your first book
        </p>
      </div>
    ) : (
      books.map((book) => (
        <Card key={book._id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <img
                src={book.coverImage || "https://via.placeholder.com/200x300?text=No+Image"}
                alt={book.title}
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/200x300?text=No+Image";
                }}
              />
              {book.isFeatured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.author?.name}</p>

              <div className="flex flex-wrap gap-1">
                {book.categories?.slice(0, 2).map((cat) => (
                  <Badge key={cat._id} variant="secondary" className="text-xs">
                    {cat.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">₹{book.price}</span>
                  {book.discountPrice && (
                    <span className="text-sm text-green-600">
                      ₹{book.discountPrice}
                    </span>
                  )}
                </div>
                <Badge
                  variant={
                    book.stock > 20
                      ? "default"
                      : book.stock > 5
                      ? "secondary"
                      : "destructive"
                  }
                >
                  Stock: {book.stock}
                </Badge>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(book._id)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);

// Form Component


// Main Component
const AdminBooksPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [creating, setCreating] = useState(false);

  const PAGE_SIZE = 8;
  const price = 10000;
  const rating = 0;

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: authorsData } = useGetAuthorsQuery();
  const {
    data: booksData,
    isLoading,
  } = useGetBooksQuery({
    page,
    limit: PAGE_SIZE,
    search,
    category: categoryFilter,
    author: authorFilter,
    price,
    rating,
  });

  const categories: Category[] = categoriesData?.categories ?? [];
  const authors: Author[] = authorsData?.authors ?? [];
  const books: Book[] = booksData?.books ?? [];

  const totalBooks = booksData?.total ?? 0;
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE);

  const [formData, setFormData] = useState<BookCreateInput>({
    title: "",
    author: "",
    categories: [],
    coverImage: "",
    price: 0,
    description: "",
    publisher: "",
    ISBN: "",
    publishedDate: "",
    stock: 0,
    pages: 0,
    language: "English",
    edition: "",
    discountPrice: 0,
    tags: [],
    isFeatured: false,
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    setFormData({
      title: "",
      author: "",
      categories: [],
      coverImage: "",
      price: 0,
      description: "",
      publisher: "",
      ISBN: "",
      publishedDate: "",
      stock: 0,
      pages: 0,
      language: "English",
      edition: "",
      discountPrice: 0,
      tags: [],
      isFeatured: false,
    });

    setCreating(false);
    setOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setAuthorFilter("all");
  };

  const handleDelete = (id: string) => {
    console.log("Delete book:", id);
  };

  const handleEdit = (id: string) => {
    console.log("edit", id);
  };

  return (
    <div className="space-y-6">


      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800 flex gap-2 items-center"><BookCopy/> Books</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      <FilterSection
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        resetFilters={resetFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        authors={authors}
      />

      {viewMode === "table" ? (
        <TableView
          books={books}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <GridView
          books={books}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddBook}
            creating={creating}
            authors={authors}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooksPage;