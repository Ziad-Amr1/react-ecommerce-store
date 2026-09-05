import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Loader2, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import BackLink from "@/components/ui/back-link";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import AuthBenefits from "@/features/auth/components/AuthBenefits";
import AuthHero from "@/features/auth/components/AuthHero";
import { sendRegistrationOTP } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/features/auth/utils/validation";

export default function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = location.state?.from || "/";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = t("validation.usernameRequired");
    } else if (username.length < 3) {
      newErrors.username = t("validation.usernameMin", { count: 3 });
    }

    // Email validation
    const emailError = validateEmail(email, t);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Phone validation (optional)
    if (phone.trim() && !/^\+?[0-9\s-]{8,}$/.test(phone.trim())) {
      newErrors.phone = t("validation.phoneInvalid");
    }

    // Password validation
    const passwordError = validatePassword(password, t);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm Password validation
    const confirmError = validateConfirmPassword(password, confirmPassword, t);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
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

      await sendRegistrationOTP(username, email, password, phone);

      // OTP sent — move to verification step
      navigate("/register/verify-otp", {
        state: { email, from },
      });
    } catch (error) {
      setApiError(getApiErrorMessage(error, t("auth.register.failed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl">
        {/* LEFT SIDE */}
        <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
          <AuthHero
            titleKey="auth.login.heroTitle"
            subtitleKey="auth.login.heroSubtitle"
            variant="primary"
          />

          <AuthBenefits variant="success" />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-center bg-(--color-surface) p-6 lg:w-1/2 lg:p-14">
          <div className="mx-auto w-full max-w-lg space-y-6">
            {/* BACK */}
            <BackLink labelKey="auth.back.toPrevious" />

            {/* Branding */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-2">
                <img
                  src="/favicon.ico"
                  alt={t("brand.logoAlt")}
                  className="size-10 object-contain"
                />

                <span className="font-display text-xl font-bold text-(--color-text-primary)">
                  {t("brand.name")}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
                {t("auth.register.title")}
              </h2>

              <p className="text-sm text-(--color-text-secondary)">
                {t("auth.register.subtitle")}
              </p>
            </div>

            {/* API ERROR */}
            {apiError && <ApiErrorBanner message={apiError} variant="default" icon />}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
              className="space-y-4"
            >
              {/* Username */}
              <div className="space-y-2">
                <label
                  htmlFor="register-username"
                  className="block text-sm font-medium text-(--color-text-primary)"
                >
                  {t("auth.register.usernameLabel")}
                </label>

                <div className="relative">
                  <Input
                    id="register-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      clearFieldError("username");
                    }}
                    placeholder={t("auth.register.usernamePlaceholder")}
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={
                      errors.username ? "register-username-error" : undefined
                    }
                    className="h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                  />

                  <User
                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
                    aria-hidden="true"
                  />
                </div>

                {errors.username && (
                  <p
                    id="register-username-error"
                    className="text-sm text-(--color-error)"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-(--color-text-primary)"
                  >
                    {t("auth.register.emailLabel")}
                  </label>

                  <div className="relative">
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearFieldError("email");
                      }}
                      placeholder={t("auth.register.emailPlaceholder")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "register-email-error" : undefined
                      }
                      className="h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                    />

                    <Mail
                      className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
                      aria-hidden="true"
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="register-email-error"
                      className="text-sm text-(--color-error)"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-phone"
                    className="block text-sm font-medium text-(--color-text-primary)"
                  >
                    {t("auth.register.phoneLabel")}
                  </label>

                  <div className="relative">
                    <Input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        clearFieldError("phone");
                      }}
                      placeholder={t("auth.register.phonePlaceholder")}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "register-phone-error" : undefined
                      }
                      className="h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                    />

                    <Phone
                      className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
                      aria-hidden="true"
                    />
                  </div>

                  {errors.phone && (
                    <p
                      id="register-phone-error"
                      className="text-sm text-(--color-error)"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Password + Confirm Password */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-(--color-text-primary)"
                  >
                    {t("auth.register.passwordLabel")}
                  </label>

                  <PasswordInput
                    id="register-password"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearFieldError("password");
                    }}
                    placeholder={t("auth.register.passwordPlaceholder")}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "register-password-error" : undefined
                    }
                    className="h-11"
                  />

                  {errors.password ? (
                    <p
                      id="register-password-error"
                      className="text-sm text-(--color-error)"
                    >
                      {errors.password}
                    </p>
                  ) : (
                    <p className="text-sm text-(--color-text-secondary)">
                      {t("auth.register.passwordHint")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-(--color-text-primary)"
                  >
                    {t("auth.register.confirmPasswordLabel")}
                  </label>

                  <PasswordInput
                    id="register-confirm-password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "register-confirm-password-error"
                        : undefined
                    }
                    className="h-11"
                  />

                  {errors.confirmPassword && (
                    <p
                      id="register-confirm-password-error"
                      className="text-sm text-(--color-error)"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* REGISTER BUTTON */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-lg text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    {t("auth.register.submitting")}
                  </>
                ) : (
                  t("auth.register.submit")
                )}
              </Button>
            </form>

            {/* SIGN IN LINK */}
            <p className="text-center text-sm text-(--color-text-secondary)">
              {t("auth.register.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                state={{ from }}
                className="rounded-sm font-medium text-(--color-link) hover:text-(--color-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
              >
                {t("auth.register.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}