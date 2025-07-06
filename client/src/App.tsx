import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Contact from "@/pages/Contact";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckOut";
import AdminDashboard from "./pages/admin/Dashboard";
import WebLayout from "./layout/webLayout";
import AdminLayout from "./layout/adminLayout";
import AdminBooksPage from "./pages/admin/Books";
import AdminUsersPage from "./pages/admin/Users";
import AdminBookDetails from "./pages/admin/BookDetails";
import BookDetailsPage from "./pages/DetailBook";
import { Toaster } from "react-hot-toast";
import EmailVerifyPage from "./pages/EmailVerification";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ScrollToTop from "./components/ScrollToTop";
import CategoriesPage from "./pages/admin/Categories";
import AuthorsPage from "./pages/admin/Authors";
import RequireAuth from "./hooks/RequireAuth";
import NotFoundPage from "./pages/404NotFound";
import NotAuthorizedPage from "./pages/AdminOnlyPage";
import AdminNewsletterPage from "./pages/admin/Newsletters";
import PaymentSuccessPage from "./pages/PaymentSuccess";
import useTabCloseEffect from "./hooks/useHandleTabCloseEffect"

const App = () => {
  useTabCloseEffect()
  return (
    <div className="relative overflow-hidden bg-primary-foreground min-h-screen">
      <ScrollToTop/>
      <Routes>
        <Route element={<WebLayout  />}>
          <Route index={true} element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<BookDetailsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="/verify-email" element={<EmailVerifyPage />} />
          <Route path="/payment" element={<PaymentSuccessPage />} />
        </Route>

        <Route path={"/admin"} element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="books" element={<AdminBooksPage />} />
          <Route path="books/:id" element={<AdminBookDetails />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="newsletters" element={<AdminNewsletterPage />} />
          <Route index={true} element={<Navigate to={"/admin/dashboard"} />} />
        </Route>
        <Route path="*" element={<NotFoundPage/>}/>
        <Route path="/forbidden" element={<NotAuthorizedPage/>}/>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
