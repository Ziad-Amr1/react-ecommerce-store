import { BadgeCheck, Check } from "lucide-react";

import {
  verifyRegistrationOTP,
  verifyForgotPasswordOTP,
} from "./auth.service";

import { validatePassword } from "./utils/validation";

const newPasswordField = {
  id: "verify-otp-new-password",
  name: "newPassword",
  type: "password",
  autoComplete: "new-password",
  labelKey: "auth.verifyOtp.newPasswordLabel",
  placeholderKey: "auth.verifyOtp.newPasswordPlaceholder",
  validate: validatePassword,
};

export const OTP_FLOWS = {
  register: {
    layout: "card",
    compact: true,
    showLogo: false,
    apiErrorVariant: "default",
    buttonRadius: "rounded-lg",
    surfaceClass: "rounded-2xl shadow-xl",
    titleKey: "auth.registerVerifyOtp.title",
    subtitleKey: "auth.registerVerifyOtp.subtitle",
    otpLabelKey: "auth.registerVerifyOtp.otpLabel",
    otpPlaceholderKey: "auth.registerVerifyOtp.otpPlaceholder",
    submitKey: "auth.registerVerifyOtp.submit",
    submittingKey: "auth.registerVerifyOtp.submitting",
    failedKey: "auth.registerVerifyOtp.failed",
    back: {
      path: "/register",
      labelKey: "auth.registerVerifyOtp.backToRegister",
    },
    success: {
      titleKey: "auth.registerVerifyOtp.successTitle",
      messageKey: "auth.registerVerifyOtp.successMessage",
      goToLoginKey: "auth.registerVerifyOtp.goToLogin",
      icon: BadgeCheck,
      iconClass: "bg-(--color-success-bg) text-(--color-success)",
    },
    fields: [],
    submit: (email, otp) => verifyRegistrationOTP(email, otp),
  },
  "forgot-password": {
    layout: "split",
    compact: false,
    showLogo: true,
    apiErrorVariant: "plain",
    buttonRadius: "rounded-(--radius-lg)",
    surfaceClass: "rounded-(--radius-2xl) shadow-(--shadow-xl)",
    titleKey: "auth.verifyOtp.title",
    subtitleKey: "auth.verifyOtp.subtitle",
    otpLabelKey: "auth.verifyOtp.otpLabel",
    otpPlaceholderKey: "auth.verifyOtp.otpPlaceholder",
    submitKey: "auth.verifyOtp.submit",
    submittingKey: "auth.verifyOtp.submitting",
    failedKey: "auth.verifyOtp.failed",
    back: {
      path: "/forgot-password",
      labelKey: "auth.verifyOtp.backToForgot",
    },
    success: {
      titleKey: "auth.verifyOtp.successTitle",
      messageKey: "auth.verifyOtp.successMessage",
      goToLoginKey: "auth.verifyOtp.goToLogin",
      icon: Check,
      iconClass: "bg-(--color-success)/15 text-(--color-success)",
    },
    fields: [newPasswordField],
    submit: (email, otp, newPassword) =>
      verifyForgotPasswordOTP(email, otp, newPassword),
  },
};
