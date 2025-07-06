import { useMeQuery } from "@/services/user.service";


export function useAuth() {
  const { data, isLoading, isError } = useMeQuery();

  const isAuthenticated = !isLoading && !isError && !!data;

  const isAdmin = !isLoading && !isError && data?.user && data?.user?.role === "admin"

  return { isAuthenticated, data,  isLoading, isAdmin };
}
