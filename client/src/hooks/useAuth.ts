import { useMeQuery } from "@/services/user.service";


export function useAuth() {
  const { data, isLoading, isError } = useMeQuery();

  const isAuthenticated = !isLoading && !isError && !!data;

const isAdmin = !isLoading && !isError && data?.user && (data.user as { role?: string })?.role === "admin";


  return { isAuthenticated, data,  isLoading, isAdmin };
}
