import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { KeyRound, Check, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import AuthHero from "@/features/auth/components/AuthHero";
import { verifyForgotPasswordOTP } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { validateOtp, validatePassword } from "@/features/auth/utils/validation";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const otpError = validateOtp(otp, t);
    if (otpError) {
      newErrors.otp = otpError;
    }

    const passwordError = validatePassword(newPassword, t);
    if (passwordError) {
      newErrors.newPassword = passwordError;
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

      await verifyForgotPasswordOTP(email, otp, newPassword);

      setSuccess(true);
    } catch (error) {
      setApiError(getApiErrorMessage(error, t("auth.verifyOtp.failed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
        <div className="w-full max-w-md space-y-6 rounded-[var(--radius-2xl)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-xl)] border border-[var(--color-border)]">
          <div
            role="status"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)]"
          >
            <Check className="h-8 w-8" aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
              {t("auth.verifyOtp.successTitle")}
            </h2>

            <p className="mt-2 text-[var(--color-text-secondary)]">
              {t("auth.verifyOtp.successMessage")}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full rounded-[var(--radius-lg)] text-base font-semibold"
          >
            {t("auth.verifyOtp.goToLogin")}
          </Button>
        </div>
      </main>
    );
  }

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
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-center bg-[var(--color-surface)] p-8 lg:w-1/2 lg:p-14">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
              <img
                src="/favicon.ico"
                alt={t("brand.logoAlt")}
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                {t("auth.verifyOtp.title")}
              </h2>

              <p className="text-lg text-[var(--color-text-secondary)]">
                {t("auth.verifyOtp.subtitle", { email })}
              </p>
            </div>

            {apiError && <ApiErrorBanner message={apiError} variant="plain" />}

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
              className="space-y-4"
            >
              {/* OTP */}
              <div>
                <label
                  htmlFor="verify-otp-code"
                  className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]"
                >
                  {t("auth.verifyOtp.otpLabel")}
                </label>

                <div className="relative">
                  <Input
                    id="verify-otp-code"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value);
                      clearFieldError("otp");
                    }}
                    placeholder={t("auth.verifyOtp.otpPlaceholder")}
                    aria-invalid={Boolean(errors.otp)}
                    aria-describedby={
                      errors.otp ? "verify-otp-code-error" : undefined
                    }
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-lg)] py-6 pl-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)]"
                  />

                  <KeyRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />
                </div>

                {errors.otp && (
                  <p
                    id="verify-otp-code-error"
                    className="mt-1 text-sm text-[var(--color-error)]"
                  >
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label
                  htmlFor="verify-otp-new-password"
                  className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]"
                >
                  {t("auth.verifyOtp.newPasswordLabel")}
                </label>

                <div className="relative">
                  <Input
                    id="verify-otp-new-password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      clearFieldError("newPassword");
                    }}
                    placeholder={t("auth.verifyOtp.newPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.newPassword)}
                    aria-describedby={
                      errors.newPassword
                        ? "verify-otp-new-password-error"
                        : undefined
                    }
                    className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-lg)] py-6 pl-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)]"
                  />

                  <KeyRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />
                </div>

                {errors.newPassword && (
                  <p
                    id="verify-otp-new-password-error"
                    className="mt-1 text-sm text-[var(--color-error)]"
                  >
                    {errors.newPassword}
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
                    {t("auth.verifyOtp.submitting")}
                  </>
                ) : (
                  t("auth.verifyOtp.submit")
                )}
              </Button>
            </form>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/forgot-password")}
              className="w-full text-sm gap-2"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {t("auth.verifyOtp.backToForgot")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
