import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { loginBG } from "@/assets";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, isLoading: authloading } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useMeQuery();
  const from = localStorage.getItem("redirectAfterLogin") || "/";

  useEffect(() => {
    if (!authloading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authloading, isAuthenticated, from, navigate]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data).unwrap();
      await refetch();
      toast.success(res.message || "Login successful");

      if (isAuthenticated) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(from, { replace: true });
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error((error.data && error.data.message) || "Login failed");
    }
  };

  return (
    <div className="mt-[4.5rem] grid grid-cols-1 md:grid-cols-2">
      {/* Motivational Image/Quote */}
      <div className="hidden md:flex flex-col items-center justify-center px-6 py-10">
        <img
          src={loginBG}
          alt="Motivational Reading"
          className="max-w-4xl mb-6"
        />
        <h2 className="text-lg font-semibold text-center text-muted-foreground">
          “A reader lives a thousand lives before he dies...” – George R.R.
          Martin
        </h2>
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 md:px-20 py-10">
        <div className="w-full max-w-md mx-auto space-y-6 bg-white rounded-2xl p-4">
          <div>
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-muted-foreground text-sm">
              Welcome back! Please enter your credentials to continue.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-medium hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
