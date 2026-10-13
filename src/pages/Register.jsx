import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "react-toastify";

import registerSchema from "../validation/registerSchema";
import { register as registerUser } from "../services/authservice";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      // Strictly pass authorized registration fields
      const payload = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      await registerUser(payload);

      toast.success("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-8">
        <h1 className="mb-5 text-center text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
          Create Account
        </h1>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
          noValidate
        >
          {/* Username */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              autoComplete="username"
              {...register("username")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.username
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500 sm:text-sm">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 sm:text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter strong password"
              autoComplete="new-password"
              {...register("password")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 sm:text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition sm:px-4 sm:text-base ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 sm:text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-600 sm:text-sm">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
