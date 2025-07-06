import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMergeCartMutation, useGetCartQuery } from "@/services/cart.service";
import type { RootState } from "@/services/store";
import { clearCart } from "@/features/cartSlice";
import { useAuth } from "@/hooks/useAuth";

const WebLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { isAuthenticated } = useAuth();
  const guestCart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [mergeCart] = useMergeCartMutation();
  const {  refetch } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });


  const hasMerged = useRef(false);

useEffect(() => {
  if (isAuthenticated && guestCart.length > 0 && !hasMerged.current) {
    hasMerged.current = true;

    const guestItemsCopy = [...guestCart]; // avoid mutating during async ops
    dispatch(clearCart()); // clear guest cart first

    mergeCart(guestItemsCopy).then(() => {
      refetch(); // update server cart
    });
  }
}, [isAuthenticated, guestCart, mergeCart, dispatch, refetch]);


  useEffect(() => {
    if (!isAuthenticated) {
      hasMerged.current = false;
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default WebLayout;
