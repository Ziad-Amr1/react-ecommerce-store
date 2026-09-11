import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";

describe("Test setup smoke test", () => {
  it("should render a React component to jsdom and expose jest-dom matchers", () => {
    render(createElement("button", { type: "button" }, "Hello test"));

    expect(
      screen.getByRole("button", { name: /hello test/i }),
    ).toBeInTheDocument();
  });
});
