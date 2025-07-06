import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/services/auth.service";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useMeQuery } from "@/services/user.service";

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must include at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Must include at least one special character",
    }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const { isAuthenticated, isLoading: authloading } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useMeQuery();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  useEffect(() => {
    if (!authloading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authloading, isAuthenticated, from, navigate]);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await register(data).unwrap();
      toast.success(
        res.message || "Signup successful! Please verify your email."
      );
      await refetch();
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error((error.data && error.data.message) || "Signup Failed");
    }
  };

  return (
    <div className="mt-[4.5rem] grid grid-cols-1 md:grid-cols-2">
      {/* Motivational Image/Quote */}
      <div className="hidden md:flex flex-col items-center justify-center px-6 py-10">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Signup Motivation"
          className="max-w-4xl mb-6"
        />
        <h2 className="text-lg font-semibold text-center text-muted-foreground">
          “Today a reader, tomorrow a leader.” – Margaret Fuller
        </h2>
      </div>

      {/* Signup Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 md:px-20 py-10">
        <div className="w-full max-w-md mx-auto space-y-6 bg-white p-4 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground text-sm">
              Join us and begin your reading adventure.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
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
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-medium hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
