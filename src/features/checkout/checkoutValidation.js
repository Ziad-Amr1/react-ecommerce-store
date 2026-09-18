const PHONE_REGEX = /^\+?[0-9][0-9\s-]{6,}$/;
const POSTAL_CODE_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,9}$/;

export const SUPPORTED_PAYMENT_METHODS = ["cash"];

export const INITIAL_SHIPPING_ADDRESS = {
  fullName: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  postalCode: "",
};

export function validateFullName(value, t) {
  const trimmed = value.trim();

  if (!trimmed) {
    return t("checkout.validation.fullNameRequired");
  }

  if (trimmed.length < 3) {
    return t("checkout.validation.fullNameMin");
  }

  return "";
}

export function validatePhone(value, t) {
  const trimmed = value.trim();

  if (!trimmed) {
    return t("checkout.validation.phoneRequired");
  }

  if (!PHONE_REGEX.test(trimmed)) {
    return t("validation.phoneInvalid");
  }

  return "";
}

export function validateCountry(value, t) {
  return value.trim() ? "" : t("checkout.validation.countryRequired");
}

export function validateCity(value, t) {
  return value.trim() ? "" : t("checkout.validation.cityRequired");
}

export function validateAddress(value, t) {
  const trimmed = value.trim();

  if (!trimmed) {
    return t("checkout.validation.addressRequired");
  }

  if (trimmed.length < 5) {
    return t("checkout.validation.addressMin");
  }

  return "";
}

// Postal code is optional in the current design; only guard obvious noise.
export function validatePostalCode(value, t) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return POSTAL_CODE_REGEX.test(trimmed)
    ? ""
    : t("checkout.validation.postalCodeInvalid");
}

export function validatePaymentMethod(value, t) {
  return SUPPORTED_PAYMENT_METHODS.includes(value)
    ? ""
    : t("checkout.validation.paymentMethodRequired");
}

// Mirrors the backend's required shipping fields. Returns a map of field -> key,
// empty when the form can be submitted.
export function validateShippingForm(shippingAddress, paymentMethod, t) {
  const errors = {};

  const checks = {
    fullName: validateFullName(shippingAddress.fullName, t),
    phone: validatePhone(shippingAddress.phone, t),
    country: validateCountry(shippingAddress.country, t),
    city: validateCity(shippingAddress.city, t),
    address: validateAddress(shippingAddress.address, t),
    postalCode: validatePostalCode(shippingAddress.postalCode, t),
    paymentMethod: validatePaymentMethod(paymentMethod, t),
  };

  Object.entries(checks).forEach(([field, message]) => {
    if (message) {
      errors[field] = message;
    }
  });

  return errors;
}
