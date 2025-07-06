import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, Trash2 } from "lucide-react";

const dummyUsers = [
  {
    id: 1,
    name: "Abhijeet Kumar",
    email: "abhijeet@example.com",
    joined: "2024-11-15",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    joined: "2024-12-05",
    status: "blocked",
  },
  {
    id: 3,
    name: "Rahul Das",
    email: "rahul@example.com",
    joined: "2025-01-20",
    status: "active",
  },
  {
    id: 4,
    name: "Ritika Verma",
    email: "ritika@example.com",
    joined: "2025-02-01",
    status: "active",
  },
  {
    id: 5,
    name: "Saurabh Singh",
    email: "saurabh@example.com",
    joined: "2025-03-12",
    status: "blocked",
  },
  {
    id: 6,
    name: "Anjali Mehta",
    email: "anjali@example.com",
    joined: "2025-04-05",
    status: "active",
  },
];

const AdminUsersPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page when search changes
          }}
          className="w-64"
        />
      </div>

      <div className="rounded-none border bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className={`text-xs font-medium px-2 py-1 rounded ${
                      user.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      user.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.joined}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Ban className="w-4 h-4 mr-1" />
                    {user.status === "active" ? "Block" : "Unblock"}
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
