import { useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { KeyRound, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import AuthHero from "@/features/auth/components/AuthHero";
import { OTP_FLOWS } from "@/features/auth/otpFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { validateOtp } from "@/features/auth/utils/validation";

function OtpField({
  id,
  name,
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
  label,
  placeholder,
  value,
  error,
  onChange,
  compact,
}) {
  const labelClass = compact
    ? "block text-sm font-medium text-(--color-text-primary)"
    : "mb-1 block text-sm font-bold text-(--color-text-primary)";

  const inputClass = compact
    ? "h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
    : "bg-(--color-surface-secondary) border-(--color-border) rounded-(--radius-lg) py-6 pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)";

  const iconClass = compact
    ? "pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
    : "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-(--color-text-secondary)";

  const errorClass = compact
    ? "text-sm text-(--color-error)"
    : "mt-1 text-sm text-(--color-error)";

  return (
    <div className={compact ? "space-y-2" : ""}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />

        <KeyRound className={iconClass} aria-hidden="true" />
      </div>

      {error && (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flow } = useParams();
  const { t } = useTranslation();

  const flowConfig = OTP_FLOWS[flow];
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [fieldValues, setFieldValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!flowConfig) {
    return <Navigate to="/login" replace />;
  }

  const validateForm = () => {
    const newErrors = {};

    const otpError = validateOtp(otp, t);
    if (otpError) {
      newErrors.otp = otpError;
    }

    flowConfig.fields.forEach((field) => {
      const fieldError = field.validate(fieldValues[field.name] ?? "", t);
      if (fieldError) {
        newErrors[field.name] = fieldError;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (name) => {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const extraValues = flowConfig.fields.map(
        (field) => fieldValues[field.name] ?? "",
      );

      await flowConfig.submit(email, otp, ...extraValues);

      setSuccess(true);
    } catch (error) {
      setApiError(getApiErrorMessage(error, t(flowConfig.failedKey)));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    const SuccessIcon = flowConfig.success.icon;

    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
        <div
          className={`w-full max-w-md space-y-6 border border-(--color-border) bg-(--color-surface) p-8 text-center ${flowConfig.surfaceClass}`}
        >
          <div
            role="status"
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${flowConfig.success.iconClass}`}
          >
            <SuccessIcon className="h-8 w-8" aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
              {t(flowConfig.success.titleKey)}
            </h2>

            <p className="mt-2 text-(--color-text-secondary)">
              {t(flowConfig.success.messageKey)}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/login")}
            className={`w-full ${flowConfig.buttonRadius} text-base font-semibold`}
          >
            {t(flowConfig.success.goToLoginKey)}
          </Button>
        </div>
      </main>
    );
  }

  const compact = flowConfig.compact;

  const formContent = (
    <>
      {/* Header */}
      <div className="space-y-2 text-center">
        {flowConfig.showLogo && (
          <img
            src="/favicon.ico"
            alt={t("brand.logoAlt")}
            className="mx-auto size-24 object-contain"
          />
        )}

        <h2 className="font-display text-3xl font-bold text-(--color-text-primary)">
          {t(flowConfig.titleKey)}
        </h2>

        <p
          className={
            compact
              ? "text-base text-(--color-text-secondary)"
              : "text-lg text-(--color-text-secondary)"
          }
        >
          {t(flowConfig.subtitleKey, { email })}
        </p>
      </div>

      {/* API ERROR */}
      {apiError && (
        <ApiErrorBanner message={apiError} variant={flowConfig.apiErrorVariant} />
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-4"
      >
        {/* OTP */}
        <OtpField
          id="verify-otp-code"
          name="otp"
          type="text"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value);
            clearFieldError("otp");
          }}
          label={t(flowConfig.otpLabelKey)}
          placeholder={t(flowConfig.otpPlaceholderKey)}
          error={errors.otp}
          compact={compact}
        />

        {/* FLOW-SPECIFIC FIELDS */}
        {flowConfig.fields.map((field) => (
          <OtpField
            key={field.id}
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            value={fieldValues[field.name] ?? ""}
            onChange={(event) => {
              setFieldValues((prev) => ({
                ...prev,
                [field.name]: event.target.value,
              }));
              clearFieldError(field.name);
            }}
            label={t(field.labelKey)}
            placeholder={t(field.placeholderKey)}
            error={errors[field.name]}
            compact={compact}
          />
        ))}

        {/* SUBMIT */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className={`w-full ${flowConfig.buttonRadius} text-base font-semibold`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              {t(flowConfig.submittingKey)}
            </>
          ) : (
            t(flowConfig.submitKey)
          )}
        </Button>
      </form>

      {/* BACK */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate(flowConfig.back.path)}
        className={
          compact ? "w-full text-sm" : "w-full text-sm gap-2"
        }
      >
        {!compact && <ArrowLeft size={16} aria-hidden="true" />}
        {t(flowConfig.back.labelKey)}
      </Button>
    </>
  );

  if (flowConfig.layout === "split") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
        <div
          className={`flex w-full max-w-6xl overflow-hidden border border-(--color-border) bg-(--color-surface) ${flowConfig.surfaceClass}`}
        >
          {/* LEFT SIDE */}
          <div className="hidden w-1/2 flex-col justify-between bg-(--color-primary) p-12 text-(--color-on-primary) lg:flex">
            <AuthHero
              titleKey="auth.login.heroTitle"
              subtitleKey="auth.login.heroSubtitle"
              variant="surface"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full flex-col justify-center bg-(--color-surface) p-8 lg:w-1/2 lg:p-14">
            <div className="mx-auto w-full max-w-md space-y-6">{formContent}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
      <div
        className={`w-full max-w-md space-y-6 border border-(--color-border) bg-(--color-surface) p-8 ${flowConfig.surfaceClass}`}
      >
        {formContent}
      </div>
    </main>
  );
}
