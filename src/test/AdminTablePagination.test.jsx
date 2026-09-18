import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminTablePagination from "../features/admin/components/AdminTablePagination";

const LABEL_PREFIX = "orders.pagination";

describe("AdminTablePagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <AdminTablePagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("disables the previous button on the first page", () => {
    render(
      <AdminTablePagination
        currentPage={1}
        totalPages={3}
        onPageChange={vi.fn()}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("enables both buttons on a middle page", () => {
    render(
      <AdminTablePagination
        currentPage={2}
        totalPages={3}
        onPageChange={vi.fn()}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <AdminTablePagination
        currentPage={3}
        totalPages={3}
        onPageChange={vi.fn()}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("reports previous/next steps through onPageChange", () => {
    const onPageChange = vi.fn();
    render(
      <AdminTablePagination
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("shows the current page and total pages", () => {
    render(
      <AdminTablePagination
        currentPage={2}
        totalPages={5}
        onPageChange={vi.fn()}
        labelPrefix={LABEL_PREFIX}
      />,
    );

    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });
});