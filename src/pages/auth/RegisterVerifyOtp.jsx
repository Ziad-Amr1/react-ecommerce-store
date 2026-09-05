import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { KeyRound, Loader2, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import { verifyRegistrationOTP } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

export default function RegisterVerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = t("validation.otpRequired");
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

      await verifyRegistrationOTP(email, otp);

      setSuccess(true);
    } catch (error) {
      setApiError(getApiErrorMessage(error, t("auth.registerVerifyOtp.failed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-xl">
          <div
            role="status"
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)"
          >
            <BadgeCheck className="size-8" aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
              {t("auth.registerVerifyOtp.successTitle")}
            </h2>

            <p className="mt-2 text-(--color-text-secondary)">
              {t("auth.registerVerifyOtp.successMessage")}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full rounded-lg text-base font-semibold"
          >
            {t("auth.registerVerifyOtp.goToLogin")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 shadow-xl">
        {/* Logo */}
        <div className="space-y-2 text-center">
          <h2 className="font-display text-3xl font-bold text-(--color-text-primary)">
            {t("auth.registerVerifyOtp.title")}
          </h2>

          <p className="text-base text-(--color-text-secondary)">
            {t("auth.registerVerifyOtp.subtitle", { email })}
          </p>
        </div>

        {/* API ERROR */}
        {apiError && <ApiErrorBanner message={apiError} variant="default" />}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="space-y-4"
        >
          {/* OTP */}
          <div className="space-y-2">
            <label
              htmlFor="register-verify-otp-code"
              className="block text-sm font-medium text-(--color-text-primary)"
            >
              {t("auth.registerVerifyOtp.otpLabel")}
            </label>

            <div className="relative">
              <Input
                id="register-verify-otp-code"
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
                placeholder={t("auth.registerVerifyOtp.otpPlaceholder")}
                aria-invalid={Boolean(errors.otp)}
                aria-describedby={
                  errors.otp ? "register-verify-otp-code-error" : undefined
                }
                className="h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
              />

              <KeyRound
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
                aria-hidden="true"
              />
            </div>

            {errors.otp && (
              <p
                id="register-verify-otp-code-error"
                className="text-sm text-(--color-error)"
              >
                {errors.otp}
              </p>
            )}
          </div>

          {/* VERIFY BUTTON */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-lg text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {t("auth.registerVerifyOtp.submitting")}
              </>
            ) : (
              t("auth.registerVerifyOtp.submit")
            )}
          </Button>
        </form>

        {/* BACK LINK */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/register")}
          className="w-full text-sm"
        >
          {t("auth.registerVerifyOtp.backToRegister")}
        </Button>
      </div>
    </main>
  );
}