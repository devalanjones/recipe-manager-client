import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import loginSchema from "../validation/loginSchema";
import { login } from "../services/authservice";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data);

      // Handle both direct data return or axios wrapped response
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (token) {
        localStorage.setItem("token", token);

        // Store user payload (includes role: "admin" | "user")
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        toast.success("Login successful!");

        // Role-based routing
        if (user?.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Invalid login response");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-8">
        <h2 className="mb-5 text-center text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />

            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />

            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.password?.message}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="pt-2 text-center text-xs text-gray-600 sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}