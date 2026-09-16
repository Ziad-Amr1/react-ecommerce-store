
export function validateProfile(formData , t) {
    
  const errors = {};

  if (!formData.username.trim()) {
    errors.username = t("profile.validation.usernameRequired");
  }

  if (!formData.phone.trim()) {
    errors.phone = t("profile.validation.phoneRequired");
  }

  return errors;
}