import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { KeyRound, Check, Shield, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyForgotPasswordOTP } from "@/features/auth/auth.service";

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

    if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = t("validation.otpRequired");
    }

    if (!newPassword) {
      newErrors.newPassword = t("validation.passwordRequired");
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t("validation.passwordMin", { count: 6 });
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
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t("auth.verifyOtp.failed");

      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
        <div className="w-full max-w-md space-y-6 rounded-(--radius-2xl) bg-(--color-surface) p-8 text-center shadow-(--shadow-xl) border border-(--color-border)">
          <div
            role="status"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--color-success)/15 text-(--color-success)"
          >
            <Check className="h-8 w-8" aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
              {t("auth.verifyOtp.successTitle")}
            </h2>

            <p className="mt-2 text-(--color-text-secondary)">
              {t("auth.verifyOtp.successMessage")}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full rounded-(--radius-lg) text-base font-semibold"
          >
            {t("auth.verifyOtp.goToLogin")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-(--radius-2xl) bg-(--color-surface) shadow-(--shadow-xl) border border-(--color-border)">
        {/* LEFT SIDE */}
        <div className="hidden w-1/2 flex-col justify-between bg-(--color-primary) p-12 text-(--color-on-primary) lg:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <Shield
                className="h-14 w-14 rounded-(--radius-lg) bg-(--color-surface)/10 p-2 text-(--color-on-primary)"
                aria-hidden="true"
              />

              <span className="text-4xl font-display font-bold">
                {t("brand.name")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight">
              {t("auth.login.heroTitle")}
            </h1>

            <p className="mt-4 text-lg text-(--color-on-primary)/80">
              {t("auth.login.heroSubtitle")}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-center bg-(--color-surface) p-8 lg:w-1/2 lg:p-14">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
              <img
                src="/favicon.ico"
                alt={t("brand.logoAlt")}
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="font-display text-3xl font-bold text-(--color-text-primary)">
                {t("auth.verifyOtp.title")}
              </h2>

              <p className="text-lg text-(--color-text-secondary)">
                {t("auth.verifyOtp.subtitle", { email })}
              </p>
            </div>

            {apiError && (
              <div
                role="alert"
                className="rounded-(--radius-lg) border border-(--color-error)/25 bg-(--color-error-bg) p-3 text-center text-sm font-medium text-(--color-error)"
              >
                {apiError}
              </div>
            )}

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
                  className="mb-1 block text-sm font-bold text-(--color-text-primary)"
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
                    className="bg-(--color-surface-secondary) border-(--color-border) rounded-(--radius-lg) py-6 pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                  />

                  <KeyRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-(--color-text-secondary)"
                    aria-hidden="true"
                  />
                </div>

                {errors.otp && (
                  <p
                    id="verify-otp-code-error"
                    className="mt-1 text-sm text-(--color-error)"
                  >
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label
                  htmlFor="verify-otp-new-password"
                  className="mb-1 block text-sm font-bold text-(--color-text-primary)"
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
                    className="bg-(--color-surface-secondary) border-(--color-border) rounded-(--radius-lg) py-6 pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                  />

                  <KeyRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-(--color-text-secondary)"
                    aria-hidden="true"
                  />
                </div>

                {errors.newPassword && (
                  <p
                    id="verify-otp-new-password-error"
                    className="mt-1 text-sm text-(--color-error)"
                  >
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-(--radius-lg) text-base font-semibold"
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
