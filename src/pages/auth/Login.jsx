import { useState } from "react";
import { useNavigate } from "react-router";

import {
  Lock,
  Mail,
  Check,
  Shield,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { login, isLoading } = useAuth();

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

  const clearFieldError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    setApiError("");
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
        <div className="hidden w-1/2 flex-col justify-between bg-[var(--color-primary)] p-12 text-[var(--color-on-primary)] lg:flex">

          <div>

            <div className="mb-10 flex items-center gap-3">

              <Shield
                className="h-14 w-14 rounded-[var(--radius-lg)] bg-[var(--color-surface)]/10 p-2 text-[var(--color-on-primary)]"
                aria-hidden="true"
              />

              <span className="text-4xl font-display font-bold">
                Oversea Store
              </span>

            </div>

            <h1 className="font-display text-4xl font-bold leading-tight">
              Manage Your Store Like a Pro
            </h1>

            <p className="mt-4 text-lg text-[var(--color-on-primary)]/80">
              Control products, orders, users, carts and analytics
              from a modern dashboard experience.
            </p>

          </div>

          <ul className="space-y-4">

            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">

              <Check className="h-6 w-6 shrink-0 text-[var(--color-success)]" aria-hidden="true" />

              <span className="text-base font-medium">
                Product Management
              </span>

            </li>

            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">

              <Check className="h-6 w-6 shrink-0 text-[var(--color-success)]" aria-hidden="true" />

              <span className="text-base font-medium">
                Order Tracking
              </span>

            </li>

            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">

              <Check className="h-6 w-6 shrink-0 text-[var(--color-success)]" aria-hidden="true" />

              <span className="text-base font-medium">
                Customer Insights
              </span>

            </li>

          </ul>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-center bg-[var(--color-surface)] p-8 lg:w-1/2 lg:p-14">

          <div className="mx-auto w-full max-w-md space-y-6">

            {/* Logo */}
            <div className="text-center">

              <img
                src="/favicon.ico"
                alt="Oversea Store Logo"
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                Welcome Back
              </h2>

              <p className="text-lg text-[var(--color-text-secondary)]">
                Sign in to your admin dashboard
              </p>

            </div>

            {/* API ERROR */}
            {apiError && (
              <div
                role="alert"
                className="rounded-[var(--radius-lg)] border border-[var(--color-error)]/25 bg-[var(--color-error-bg)] p-3 text-center text-sm font-medium text-[var(--color-error)]"
              >
                {apiError}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="login-email"
                  className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearFieldError("email");
                    }}
                    placeholder="admin@gmail.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-lg)] py-6 pl-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)]"
                  />

                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />

                </div>

                {errors.email && (
                  <p id="login-email-error" className="mt-1 text-sm text-[var(--color-error)]">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="login-password"
                  className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]"
                >
                  Password
                </label>

                <div className="relative">

                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearFieldError("password");
                    }}
                    placeholder="••••••••"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-lg)] py-6 pl-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)]"
                  />

                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />

                </div>

                {errors.password && (
                  <p id="login-password-error" className="mt-1 text-sm text-[var(--color-error)]">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-[var(--radius-lg)] text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
