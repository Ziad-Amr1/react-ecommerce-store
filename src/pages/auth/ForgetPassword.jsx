import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Mail, Check, Shield, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendForgotPasswordOTP } from "@/features/auth/auth.service";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("validation.emailInvalid");
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
      setIsSubmitting(true);

      await sendForgotPasswordOTP(email);

      navigate("/forgot-password/verify-otp", {
        state: { email },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t("auth.forgetPassword.failed");

      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
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
                {t("brand.name")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight">
              {t("auth.login.heroTitle")}
            </h1>

            <p className="mt-4 text-lg text-[var(--color-on-primary)]/80">
              {t("auth.login.heroSubtitle")}
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">
              <Check
                className="h-6 w-6 shrink-0 text-[var(--color-success)]"
                aria-hidden="true"
              />

              <span className="text-base font-medium">
                {t("auth.benefits.products")}
              </span>
            </li>

            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">
              <Check
                className="h-6 w-6 shrink-0 text-[var(--color-success)]"
                aria-hidden="true"
              />

              <span className="text-base font-medium">
                {t("auth.benefits.orders")}
              </span>
            </li>

            <li className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4">
              <Check
                className="h-6 w-6 shrink-0 text-[var(--color-success)]"
                aria-hidden="true"
              />

              <span className="text-base font-medium">
                {t("auth.benefits.customers")}
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
                alt={t("brand.logoAlt")}
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                {t("auth.forgetPassword.title")}
              </h2>

              <p className="text-lg text-[var(--color-text-secondary)]">
                {t("auth.forgetPassword.subtitle")}
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
              aria-busy={isSubmitting}
              className="space-y-4"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="forget-password-email"
                  className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]"
                >
                  {t("auth.forgetPassword.emailLabel")}
                </label>

                <div className="relative">
                  <Input
                    id="forget-password-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearFieldError("email");
                    }}
                    placeholder={t("auth.forgetPassword.emailPlaceholder")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "forget-password-email-error" : undefined
                    }
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-lg)] py-6 pl-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)]"
                  />

                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />
                </div>

                {errors.email && (
                  <p
                    id="forget-password-email-error"
                    className="mt-1 text-sm text-[var(--color-error)]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-[var(--radius-lg)] text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    {t("auth.forgetPassword.submitting")}
                  </>
                ) : (
                  t("auth.forgetPassword.submit")
                )}
              </Button>
            </form>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/login")}
              className="w-full text-sm gap-2"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {t("auth.forgetPassword.backToLogin")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
