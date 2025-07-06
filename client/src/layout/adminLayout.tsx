import {
  Menu,
  LogOut,
  BarChart2,
  Book,
  Users2,
  FileText,
  Boxes,
  PenLine,
  UserRoundCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import Logo from "@/assets/book-store-logo-2.png";
import { useLogoutMutation } from "@/services/auth.service";
import { useMeQuery } from "@/services/user.service";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menu = [
  { label: "Dashboard", icon: BarChart2, to: "/admin/dashboard" },
  { label: "Books", icon: Book, to: "/admin/books" },
  { label: "Users", icon: Users2, to: "/admin/users" },
  { label: "Newsletters", icon: FileText, to: "/admin/newsletters" },
  { label: "Categories", icon: Boxes, to: "/admin/categories" },
  { label: "Authors", icon: PenLine, to: "/admin/authors" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { data, refetch } = useMeQuery();
  const {isAdmin, isAuthenticated, isLoading} = useAuth();
  console.log(isAdmin, isAuthenticated, isLoading)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/forbidden");
    }
  }, [isAuthenticated, isLoading, navigate, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      await refetch();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-white to-blue-50 border-r shadow-md">
        <div className="h-16 flex items-center justify-center border-b bg-blue-950">
          <h1 className="text-md font-extrabold text-cyan-300 tracking-tight flex gap-2 items-center">
            <UserRoundCog /> Administration{" "}
            <span className="text-orange-500">control</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar */}
        <div className="sticky top-0 z-10 h-16 px-4 border-b bg-white/90 backdrop-blur-sm flex items-center justify-between shadow-sm">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-16 flex items-center justify-center border-b bg-blue-100 text-blue-700 font-bold">
                Admin Panel
              </div>
              <nav className="px-4 py-6 space-y-2">
                {menu.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 text-slate-600"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search + Admin Info */}
          <div className="flex items-center justify-between gap-4 w-full">
            <img
              src={Logo}
              alt="BookStore Logo"
              onClick={() => (window.location.href = "/")}
              className="h-12 w-auto object-contain"
            />
            <span className="text-sm text-slate-600 hidden md:block">
              Admin:{" "}
              <span className="font-semibold text-blue-600">
                {data?.data?.email || "admin@bookstore.in"}
              </span>
            </span>
          </div>
        </div>

        {/* Routed Content */}
        <div className="p-6 bg-slate-50 h-[calc(100vh-4rem)] overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
