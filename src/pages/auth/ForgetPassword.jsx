import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Mail, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import AuthBenefits from "@/features/auth/components/AuthBenefits";
import AuthHero from "@/features/auth/components/AuthHero";
import { sendForgotPasswordOTP } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { validateEmail } from "@/features/auth/utils/validation";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(email, t);
    if (emailError) {
      newErrors.email = emailError;
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
      setApiError(getApiErrorMessage(error, t("auth.forgetPassword.failed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)] border border-[var(--color-border)]">
        {/* LEFT SIDE */}
        <div className="hidden w-1/2 flex-col justify-between bg-[var(--color-primary)] p-12 text-[var(--color-on-primary)] lg:flex">
          <AuthHero
            titleKey="auth.login.heroTitle"
            subtitleKey="auth.login.heroSubtitle"
            variant="surface"
          />

          <AuthBenefits variant="surface" />
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
            {apiError && <ApiErrorBanner message={apiError} variant="plain" />}

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
