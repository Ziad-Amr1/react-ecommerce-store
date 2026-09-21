import { describe, it, expect } from "vitest";
import { validateProfile } from "./profileValidation";

describe("validateProfile", () => {
  it("returns no errors for valid data", () => {
    const result = validateProfile({
      username: "arwa",
      phone: "01123456789",
    });

    expect(result).toEqual({});
  });
});