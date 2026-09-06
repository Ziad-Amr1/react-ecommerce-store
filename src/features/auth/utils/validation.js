const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;
const PASSWORD_MIN = 6;

export const validateEmail = (value, t) => {
  if (!value.trim()) {
    return t("validation.emailRequired");
  }

  if (!EMAIL_REGEX.test(value)) {
    return t("validation.emailInvalid");
  }

  return "";
};

export const validatePassword = (value, t) => {
  if (!value) {
    return t("validation.passwordRequired");
  }

  if (value.length < PASSWORD_MIN) {
    return t("validation.passwordMin", { count: PASSWORD_MIN });
  }

  return "";
};

export const validateConfirmPassword = (password, value, t) => {
  if (!value) {
    return t("validation.confirmPasswordRequired");
  }

  if (value !== password) {
    return t("validation.confirmPasswordMismatch");
  }

  return "";
};

export const validateOtp = (value, t) => {
  if (!OTP_REGEX.test(value)) {
    return t("validation.otpRequired");
  }

  return "";
};