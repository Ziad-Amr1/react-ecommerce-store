import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiErrorBanner from "@/features/auth/components/ApiErrorBanner";
import AuthBenefits from "@/features/auth/components/AuthBenefits";
import AuthHero from "@/features/auth/components/AuthHero";
import { sendRegistrationOTP } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { validateEmail, validatePassword } from "@/features/auth/utils/validation";

export default function Registration() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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
        state: { email },
      });
    } catch (error) {
      setApiError(getApiErrorMessage(error, t("auth.register.failed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Built per render so closures bind to the current state,
  // errors, and handlers without changing any logic.
  const fields = [
    {
      id: "register-username",
      name: "username",
      type: "text",
      autoComplete: "username",
      labelKey: "auth.register.usernameLabel",
      placeholderKey: "auth.register.usernamePlaceholder",
      icon: User,
      value: username,
      error: errors.username,
      onChange: (event) => {
        setUsername(event.target.value);
        clearFieldError("username");
      },
    },
    {
      id: "register-email",
      name: "email",
      type: "email",
      autoComplete: "email",
      labelKey: "auth.register.emailLabel",
      placeholderKey: "auth.register.emailPlaceholder",
      icon: Mail,
      value: email,
      error: errors.email,
      onChange: (event) => {
        setEmail(event.target.value);
        clearFieldError("email");
      },
    },
    {
      id: "register-phone",
      name: "phone",
      type: "tel",
      autoComplete: "tel",
      labelKey: "auth.register.phoneLabel",
      placeholderKey: "auth.register.phonePlaceholder",
      icon: Phone,
      value: phone,
      error: errors.phone,
      onChange: (event) => {
        setPhone(event.target.value);
        clearFieldError("phone");
      },
    },
    {
      id: "register-password",
      name: "password",
      type: "password",
      autoComplete: "new-password",
      labelKey: "auth.register.passwordLabel",
      placeholderKey: "auth.register.passwordPlaceholder",
      helpKey: "auth.register.passwordHint",
      icon: Lock,
      value: password,
      error: errors.password,
      onChange: (event) => {
        setPassword(event.target.value);
        clearFieldError("password");
      },
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
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
        <div className="flex w-full flex-col justify-center bg-(--color-surface) p-8 lg:w-1/2 lg:p-14">
          <div className="mx-auto w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="space-y-2 text-center">
              <img
                src="/favicon.ico"
                alt={t("brand.logoAlt")}
                className="mx-auto mb-4 size-24 object-contain"
              />

              <h2 className="font-display text-3xl font-bold text-(--color-text-primary)">
                {t("auth.register.title")}
              </h2>

              <p className="text-base text-(--color-text-secondary)">
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
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.id} className="space-y-2">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-(--color-text-primary)"
                    >
                      {t(field.labelKey)}
                    </label>

                    <div className="relative">
                      <Input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t(field.placeholderKey)}
                        aria-invalid={Boolean(field.error)}
                        aria-describedby={
                          field.error ? `${field.id}-error` : undefined
                        }
                        className="h-11 rounded-lg border-(--color-border) bg-(--color-surface-secondary) pl-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)"
                      />

                      <Icon
                        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
                        aria-hidden="true"
                      />
                    </div>

                    {field.error ? (
                      <p
                        id={`${field.id}-error`}
                        className="text-sm text-(--color-error)"
                      >
                        {field.error}
                      </p>
                    ) : (
                      field.helpKey && (
                        <p className="text-sm text-(--color-text-secondary)">
                          {t(field.helpKey)}
                        </p>
                      )
                    )}
                  </div>
                );
              })}

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