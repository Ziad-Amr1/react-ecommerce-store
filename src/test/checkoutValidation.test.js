import { describe, it, expect } from "vitest";
import {
  INITIAL_SHIPPING_ADDRESS,
  validateShippingForm,
} from "@/features/checkout/checkoutValidation";

const t = (key) => key;

const validAddress = {
  fullName: "Jane Smith",
  phone: "+20 100 000 0000",
  country: "Egypt",
  city: "Cairo",
  address: "123 Nile Street, Apt 4",
  postalCode: "",
};

describe("validateShippingForm", () => {
  it("accepts a complete form with cash payment", () => {
    expect(validateShippingForm(validAddress, "cash", t)).toEqual({});
  });

  it("treats the postal code as optional", () => {
    expect(validateShippingForm(validAddress, "cash", t).postalCode).toBeUndefined();
  });

  it("flags every missing required field on an empty form", () => {
    const errors = validateShippingForm(INITIAL_SHIPPING_ADDRESS, "cash", t);

    expect(errors).toMatchObject({
      fullName: "checkout.validation.fullNameRequired",
      phone: "checkout.validation.phoneRequired",
      country: "checkout.validation.countryRequired",
      city: "checkout.validation.cityRequired",
      address: "checkout.validation.addressRequired",
    });
  });

  it("rejects malformed name, phone, address and postal code", () => {
    const errors = validateShippingForm(
      {
        ...validAddress,
        fullName: "JD",
        phone: "not-a-phone",
        address: "no",
        postalCode: "!!",
      },
      "cash",
      t,
    );

    expect(errors.fullName).toBe("checkout.validation.fullNameMin");
    expect(errors.phone).toBe("validation.phoneInvalid");
    expect(errors.address).toBe("checkout.validation.addressMin");
    expect(errors.postalCode).toBe("checkout.validation.postalCodeInvalid");
  });

  it("rejects unsupported payment methods", () => {
    const errors = validateShippingForm(validAddress, "stripe", t);

    expect(errors.paymentMethod).toBe("checkout.validation.paymentMethodRequired");
  });
});
