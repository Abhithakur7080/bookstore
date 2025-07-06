import {
  ShoppingCart,
  LogIn,
  Home,
  BookOpen,
  Phone,
  Menu,
  User,
  Package,
  LifeBuoy,
  FileText,
  LogOut,
  BarChart2,
  Book,
  Users2,
  Boxes,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "@/assets/book-store-logo-2.png";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/services/auth.service";
import { useMeQuery } from "@/services/user.service";
import { useCart } from "@/hooks/useCart";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cartSlice";

const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 relative pb-1 transition-colors 
   ${isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900"} 
   after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full 
   after:bg-primary after:origin-left after:scale-x-0 
   ${isActive ? "after:scale-x-100" : ""} 
   after:transition-transform after:duration-300 after:ease-in-out`;

const Navbar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const {totalCount : cartCount = 0} = useCart();

  const [logout] = useLogoutMutation();
  const { refetch } = useMeQuery();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      await refetch();
      dispatch(clearCart())
      localStorage.removeItem("redirectAfterLogin")
      navigate("/")
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="w-full shadow-sm border-b bg-gradient-to-r from-white via-pink-100 to-white fixed top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div>
          <img
            src={Logo}
            alt="BookStore Logo"
            onClick={() => (window.location.href = "/")}
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-700">
          <NavLink to="/" className={navLinkStyles}>
            <Home className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkStyles}>
            <BookOpen className="w-4 h-4" />
            Shop
          </NavLink>
          <NavLink to="/contact" className={navLinkStyles}>
            <Phone className="w-4 h-4" />
            Contact
          </NavLink>
        </nav>

        {/* Right: Cart + Login */}
        <div className="flex items-center gap-6">
          <Link to ={"/cart"}>
          <div className="relative">
            <ShoppingCart className="h-6 w-6 text-slate-900" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 bg-red-500 text-white rounded-full">
                {cartCount}
              </Badge>
            )}
          </div>
          </Link>

          {isAuthenticated ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex relative"
                >
                  <User className="w-5 h-5 text-slate-800" />
                  {Boolean(isAdmin) && (
                    <Badge className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] italic bg-gradient-to-br from-yellow-600  to-red-600">
                      ADMIN
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                {isAdmin ? (
                  <div className="flex flex-col gap-2 text-sm text-slate-700">
                    <NavLink
                      to="/admin/dashboard"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/books"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <Book className="w-4 h-4" />
                      Books
                    </NavLink>
                    <NavLink
                      to="/admin/users"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <Users2 className="w-4 h-4" />
                      users
                    </NavLink>
                    <NavLink
                      to="/admin/newsletters"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <FileText className="w-4 h-4" />
                      Newsletters
                    </NavLink>
                    <NavLink
                      to="/admin/categories"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <Boxes className="w-4 h-4" />
                      Categories
                    </NavLink>
                    <NavLink
                      to="/admin/authors"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <PenLine className="w-4 h-4" />
                      Authors
                    </NavLink>
                    <Separator />
                    <Button
                      variant={"destructive"}
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 rounded-md "
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 text-sm text-slate-700">
                    <NavLink
                      to="/orders"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </NavLink>
                    <NavLink
                      to="/support"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <LifeBuoy className="w-4 h-4" />
                      Support
                    </NavLink>
                    <NavLink
                      to="/terms"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100"
                    >
                      <FileText className="w-4 h-4" />
                      Terms & Conditions
                    </NavLink>
                    <Separator />
                    <Button
                      variant={"destructive"}
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 rounded-md "
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          ) : (
            <Link to={"/login"}>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] bg-white p-4">
                <div className="flex flex-col gap-3 mt-10 text-slate-700">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </NavLink>
                  <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <BookOpen className="w-4 h-4" />
                    Shop
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </NavLink>
                  <Separator />
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2 text-sm text-slate-700">
                      <NavLink
                        to="/orders"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-100"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </NavLink>
                      <NavLink
                        to="/support"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-100"
                      >
                        <LifeBuoy className="w-4 h-4" />
                        Support
                      </NavLink>
                      <NavLink
                        to="/terms"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-100"
                      >
                        <FileText className="w-4 h-4" />
                        Terms & Conditions
                      </NavLink>
                      <Separator />
                      <Button
                        variant="destructive"
                        onClick={() => {
                          localStorage.removeItem("token");
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="mt-4 flex justify-start items-center gap-4 w-full"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  )}
                </div>
                <div className="mt-auto pt-6 border-t text-xs text-muted-foreground text-center">
                  © 2025 BookStore Inc.
                  <br />
                  Version 1.0.0
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
