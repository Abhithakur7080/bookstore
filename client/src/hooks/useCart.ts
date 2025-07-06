import { useSelector, useDispatch } from "react-redux";
import { useGetCartQuery } from "@/services/cart.service";
import { useAuth } from "@/hooks/useAuth";
import type { RootState } from "@/services/store";
import { clearCart, replaceCart } from "@/features/cartSlice"; // adjust path if needed
import type { CartItem } from "@/types/cart";

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  // For authenticated user: Fetch from backend
  const {
    data: cartData = { items: [] },
    refetch,
    isFetching,
    isLoading,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  // For guest user: Redux store items
  const guestItems = useSelector((state: RootState) => state.cart.items);

  const carts: CartItem[] = isAuthenticated ? cartData.items : guestItems;
  const totalCount = carts.reduce((acc, item) => acc + item.quantity, 0);

  return {
    carts,
    totalCount,
    refetchCart: refetch,
    isLoading,
    isFetching,
    clearCartAction: () => dispatch(clearCart()),
    replaceCartAction: (items: CartItem[]) => dispatch(replaceCart(items)),
  };
};
