import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Lock,
  Mail,
  Check,
  ShoppingBag,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import logoImg from "../assets/koda-logo.png";
import googleLogo from "../assets/google-logo.svg";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setApiError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      await login(email, password);

      // Login successful
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password";

      setApiError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">

      <div className="flex w-full max-w-6xl overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)] border border-[var(--color-border)]">

        {/* LEFT SIDE */}
        <div className="hidden w-1/2 flex-col justify-start gap-10 bg-[var(--color-primary)] p-12 text-[var(--color-on-primary)] lg:flex">

          <div>

            <div className="mt-12 mb-6 flex items-center gap-3">

              <ShoppingBag
                className="h-14 w-14 rounded-[var(--radius-lg)] bg-[var(--color-surface)]/10 p-1 text-[var(--color-on-primary)]"
              />

              <span className="text-4xl font-display font-bold">
                Koda Commerce
              </span>

            </div>

            <h1 className="text-5xl font-display font-bold leading-tight">
              Manage Your Store Like a Pro
            </h1>

            <p className="mt-4 text-lg text-[var(--color-secondary)]">
              Control products, orders, users, carts and analytics
              from a modern dashboard experience.
            </p>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">

              <Check className="h-6 w-6 text-[var(--color-success)]" />

              <span className="text-base font-medium">
                Product Management
              </span>

            </div>

            <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">

              <Check className="h-6 w-6 text-[var(--color-success)]" />

              <span className="text-base font-medium">
                Order Tracking
              </span>

            </div>

            <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">

              <Check className="h-6 w-6 text-[var(--color-success)]" />

              <span className="text-base font-medium">
                Customer Insights
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-center bg-[var(--color-surface)] p-8 lg:w-1/2 lg:p-14">

          <div className="mx-auto w-full max-w-md space-y-6">

            {/* Logo */}
            <div className="text-center">

              <div className="mx-auto flex items-center justify-center">

                <img
                  src={logoImg}
                  alt="Koda Store"
                  className="h-28 w-48 object-contain"
                />

              </div>

              <h3 className="-mt-2 text-3xl font-display font-bold text-[var(--color-text-primary)]">
                Welcome Back
              </h3>

              <p className="text-lg text-[var(--color-text-secondary)]">
                Sign in to your admin dashboard
              </p>

            </div>

            {/* API ERROR */}
            {apiError && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {apiError}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* EMAIL */}
              <div>

                <label className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]">
                  Email Address
                </label>

                <div className="relative">

                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: "",
                        }));
                      }

                      setApiError("");
                    }}
                    placeholder="admin@gmail.com"
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                  />

                  <Mail className="absolute left-4 top-4 h-5 w-5 text-[var(--color-text-secondary)]" />

                </div>

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]">
                  Password
                </label>

                <div className="relative">

                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);

                      if (errors.password) {
                        setErrors((prev) => ({
                          ...prev,
                          password: "",
                        }));
                      }

                      setApiError("");
                    }}
                    placeholder="••••••••"
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                  />

                  <Lock className="absolute left-4 top-4 h-5 w-5 text-[var(--color-text-secondary)]" />

                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)] py-4 font-semibold text-[var(--color-on-primary)] transition hover:opacity-90 hover:shadow-lg text-center text-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            {/* DIVIDER */}
            <div className="relative flex items-center py-2">

              <div className="flex-grow border-t border-[var(--color-border)]" />

              <span className="mx-4 flex-shrink text-xs font-mono uppercase text-[var(--color-text-secondary)]">
                OR
              </span>

              <div className="flex-grow border-t border-[var(--color-border)]" />

            </div>

            {/* GOOGLE */}
            <Link
              to="/google-auth"
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] py-4 font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-secondary)] hover:shadow-xl text-center text-base"
            >

              <img
                src={googleLogo}
                alt="Google Logo"
                className="h-5 w-5"
              />

              Continue with Google

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}