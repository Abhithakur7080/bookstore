import {
  BookOpen,
  User,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500 shadow-sm bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800">Users</CardTitle>
            <User className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">1,204</div>
            <p className="text-xs text-blue-700">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500 shadow-sm bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-purple-800">Books</CardTitle>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">458</div>
            <p className="text-xs text-purple-700">+12 new this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500 shadow-sm bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-yellow-800">Orders</CardTitle>
            <ShoppingCart className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">312</div>
            <p className="text-xs text-yellow-700">+8% this week</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-sm bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-green-800">Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹76,340</div>
            <p className="text-xs text-green-700">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted flex items-center justify-center text-muted-foreground rounded-md">
              <span className="text-sm">No data available</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between text-blue-800">
              <span>Self-help</span>
              <span className="font-semibold">152 books</span>
            </div>
            <div className="flex justify-between text-purple-800">
              <span>Fiction</span>
              <span className="font-semibold">109 books</span>
            </div>
            <div className="flex justify-between text-yellow-800">
              <span>Biography</span>
              <span className="font-semibold">87 books</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground bg-muted/50">
              <tr>
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "ORD123", user: "Abhishek", amt: "₹1,299", status: "Paid", date: "June 25" },
                { id: "ORD124", user: "Meena", amt: "₹799", status: "Pending", date: "June 26" },
              ].map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="py-2 px-3">{row.id}</td>
                  <td className="py-2 px-3">{row.user}</td>
                  <td className="py-2 px-3">{row.amt}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        row.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
};

export default Dashboard;
