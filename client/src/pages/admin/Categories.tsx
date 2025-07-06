import { useMemo, useState } from "react";

import TableView from "@/components/shared/TableView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { BoxesIcon, PenLine, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import type { Category } from "@/types/category";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "@/services/category.service";

const CategoriessPage = () => {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data, isLoading } = useGetCategoriesQuery();

  const total: number = data?.total ?? 0;
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleOpen = (category?: Category) => {
    setSelected(category || null);
    setName(category?.name || "");
    setDescription(category?.description || "");
    setEditMode(!!category);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && selected) {
        await updateCategory(selected).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory({ name, description }).unwrap();
        toast.success("Category created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Category?")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };
  
  const filteredCategories = useMemo(() => {
    const categories: Category[] = data?.categories ?? [];
    return categories.filter((cat) =>
      [cat.name, cat.description].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data?.categories]);

  const columns = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><BoxesIcon className="text-orange-800"/> Categories</h1>
          <p className="text-sm text-muted-foreground">Total {total} categories found</p>
        </div>
        <div className="flex-1 max-w-3xl">
          <Input type="text" placeholder="Search your category here ...." className="w-full" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        <Button onClick={() => handleOpen()} className="bg-orange-700 hover:bg-orange-600 cursor-pointer">
          <Plus className="w-4 h-4 mr-2 " />
          Add Category
        </Button>
      </div>

      {/* Table View */}
      <TableView
        data={filteredCategories}
        columns={columns}
        loading={isLoading}
        onEdit={handleOpen}
        onDelete={handleDelete}
        getId={(category) => category._id}
      />

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short Description" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSave}>{editMode ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriessPage;
