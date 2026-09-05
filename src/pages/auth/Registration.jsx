import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Check,
  CircleX,
  Loader2,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendRegistrationOTP } from "@/features/auth/auth.service";

// Keys only — translated at render time so language switching keeps working.
const BENEFIT_KEYS = [
  "auth.benefits.products",
  "auth.benefits.orders",
  "auth.benefits.customers",
];

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
    if (!email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    // Phone validation (optional)
    if (phone.trim() && !/^\+?[0-9\s-]{8,}$/.test(phone.trim())) {
      newErrors.phone = t("validation.phoneInvalid");
    }

    // Password validation
    if (!password) {
      newErrors.password = t("validation.passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("validation.passwordMin", { count: 6 });
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
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t("auth.register.failed");

      setApiError(message);
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
          <div>
            <div className="mb-10 flex items-center gap-3">
              <Shield
                className="size-14 rounded-lg border border-(--color-supporting) bg-primary-foreground/10 p-2"
                aria-hidden="true"
              />

              <span className="font-display text-4xl font-bold">
                {t("brand.name")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-balance">
              {t("auth.login.heroTitle")}
            </h1>

            <p className="mt-4 text-lg text-primary-foreground/80">
              {t("auth.login.heroSubtitle")}
            </p>
          </div>

          <ul className="space-y-4">
            {BENEFIT_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
                  <Check className="size-4" aria-hidden="true" />
                </span>

                <span className="text-base font-medium">{t(key)}</span>
              </li>
            ))}
          </ul>
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
            {apiError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-(--color-error) bg-(--color-error-bg) p-4"
              >
                <CircleX
                  className="mt-0.5 size-5 shrink-0 text-(--color-error)"
                  aria-hidden="true"
                />

                <p className="text-sm leading-5 font-medium text-(--color-error)">
                  {apiError}
                </p>
              </div>
            )}

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