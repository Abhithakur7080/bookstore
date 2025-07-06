import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { useGetNewsletterSubscribersQuery } from "@/services/user.service";

const AdminNewsletterPage = () => {
  const { data, isLoading, isError, error } = useGetNewsletterSubscribersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscribers = useMemo(() => {
    if (!data?.subscribers) return [];
    return data.subscribers.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
        <Mail className="w-5 h-5 text-blue-500" />
        Newsletter Subscribers
      </h2>

      <Card className="shadow-none border-0">
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-blue-700 font-medium">Loading subscribers...</span>
            </div>
          ) : isError ? (
            <div className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error instanceof Error ? error.message : "Something went wrong"}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm focus:ring-blue-300"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-blue-100">
                <Table >
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <TableHead className="text-white font-semibold">#</TableHead>
                      <TableHead className="text-white font-semibold">Full Name</TableHead>
                      <TableHead className="text-white font-semibold">Email</TableHead>
                      <TableHead className="text-white font-semibold">Phone</TableHead>
                      <TableHead className="text-white font-semibold">Language</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{user.fullName || "—"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || "—"}</TableCell>
                        <TableCell>{user.preferences?.language?.toUpperCase() || "EN"}</TableCell>
                      </TableRow>
                    ))}
                    {!filteredSubscribers.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-4">
                          No matching subscribers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletterPage;
