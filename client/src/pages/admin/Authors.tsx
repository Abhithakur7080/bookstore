import { useMemo, useState } from "react";
import {
  useGetAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} from "@/services/author.service";
import type { Author } from "@/types/author";

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

import { PenLine, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

const AuthorsPage = () => {
  const [createAuthor] = useCreateAuthorMutation();
  const [updateAuthor] = useUpdateAuthorMutation();
  const [deleteAuthor] = useDeleteAuthorMutation();
  const { data, isLoading } = useGetAuthorsQuery();

  const authors: Author[] = data?.authors ?? [];
  const total: number = data?.total ?? 0;

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Author | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = (author?: Author) => {
    setSelected(author || null);
    setName(author?.name || "");
    setBio(author?.bio || "");
    setEditMode(!!author);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && selected) {
        await updateAuthor(selected).unwrap();
        toast.success("Author updated");
      } else {
        await createAuthor({ name, bio }).unwrap();
        toast.success("Author created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor(id).unwrap();
      toast.success("Author deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };
  const filteredAuthors = useMemo(() => {
    const authors: Author[] = data?.authors ?? [];
    return authors.filter((cat) =>
      [cat.name, cat.bio].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data?.authors]);
  const columns = [
    { key: "name", header: "Name" },
    { key: "bio", header: "Bio" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><PenLine className="text-orange-800"/> Authors</h1>
          <p className="text-sm text-muted-foreground">
            Total {total} authors found
          </p>
        </div>
        <div className="flex-1 max-w-3xl">
          <Input
            type="text"
            placeholder="Search your author here ...."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpen()} className="bg-orange-700 hover:bg-orange-600 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Add Author
        </Button>
      </div>

      {/* Table View */}
      <TableView
        data={filteredAuthors}
        columns={columns}
        loading={isLoading}
        onEdit={handleOpen}
        onDelete={handleDelete}
        getId={(author) => author._id}
      />

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Author" : "Add Author"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-1">
              <Label>Bio</Label>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSave}>
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthorsPage;
