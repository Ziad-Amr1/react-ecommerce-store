// Matches the pattern used in features/auth/utils/validation.js:
// each validator takes (value, t) and returns "" when valid, or a
// translated error message.

const PHONE_REGEX = /^[+\d][\d\s-]{6,}$/;
const POSTAL_CODE_REGEX = /^[A-Za-z0-9\s-]{3,10}$/;

export const validateFullName = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.fullNameRequired");
  }
  if (value.trim().length < 3) {
    return t("checkout.validation.fullNameMin");
  }
  return "";
};

export const validatePhone = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.phoneRequired");
  }
  if (!PHONE_REGEX.test(value.trim())) {
    return t("validation.phoneInvalid");
  }
  return "";
};

export const validateCountry = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.countryRequired");
  }
  return "";
};

export const validateCity = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.cityRequired");
  }
  return "";
};

export const validateAddress = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.addressRequired");
  }
  if (value.trim().length < 5) {
    return t("checkout.validation.addressMin");
  }
  return "";
};

export const validatePostalCode = (value, t) => {
  if (!value.trim()) {
    return t("checkout.validation.postalCodeRequired");
  }
  if (!POSTAL_CODE_REGEX.test(value.trim())) {
    return t("checkout.validation.postalCodeInvalid");
  }
  return "";
};

export const validatePaymentMethod = (value, t) => {
  if (!value) {
    return t("checkout.validation.paymentMethodRequired");
  }
  return "";
};

// Runs every field validator and returns a { field: message } map.
// Empty object means the shipping form is valid.
export function validateShippingForm(shippingAddress, paymentMethod, t) {
  const errors = {};

  const fullNameError = validateFullName(shippingAddress.fullName, t);
  if (fullNameError) errors.fullName = fullNameError;

  const phoneError = validatePhone(shippingAddress.phone, t);
  if (phoneError) errors.phone = phoneError;

  const countryError = validateCountry(shippingAddress.country, t);
  if (countryError) errors.country = countryError;

  const cityError = validateCity(shippingAddress.city, t);
  if (cityError) errors.city = cityError;

  const addressError = validateAddress(shippingAddress.address, t);
  if (addressError) errors.address = addressError;

  const postalCodeError = validatePostalCode(shippingAddress.postalCode, t);
  if (postalCodeError) errors.postalCode = postalCodeError;

  const paymentMethodError = validatePaymentMethod(paymentMethod, t);
  if (paymentMethodError) errors.paymentMethod = paymentMethodError;

  return errors;
}
