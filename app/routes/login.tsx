import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputController } from "~/components/formController";
import { Button } from "~/components/ui/button";
import { Mail, Lock, LogIn } from "lucide-react";
import LoadingSpinner from "~/components/LoadindSpinner";
import cookieService from "~/services/cookie.service";
import { TOKEN } from "~/utils/constant";
import { useNavigate } from "react-router";

// Define validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      // Add your login logic here
      // For example: await loginUser(data.email, data.password);

      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          const token = `Bearer ${data.email}`;
          cookieService.setCookie(TOKEN, token);
          navigate("/");
          resolve(true);
          reset();
        }, 1500);
      });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <InputController
                name="email"
                control={control}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
                icon={Mail}
                labelClassName="text-sm font-medium text-gray-700"
              />

              <InputController
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
                icon={Lock}
                labelClassName="text-sm font-medium text-gray-700"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
