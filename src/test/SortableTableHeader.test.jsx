import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortableTableHeader from "../features/admin/components/SortableTableHeader";

const columns = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date", sortable: true, sortKey: "date" },
  { key: "amount", label: "Amount", sortable: true, sortKey: "amount", align: "end" },
];

describe("SortableTableHeader", () => {
  it("renders every column label, sortable or not", () => {
    render(<SortableTableHeader columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("renders sortable columns as native buttons for keyboard access", () => {
    render(<SortableTableHeader columns={columns} />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Date/ })).toBeInTheDocument();
  });

  it("does not call onSort when a non-sortable column is clicked", () => {
    const onSort = vi.fn();
    render(<SortableTableHeader columns={columns} onSort={onSort} />);

    fireEvent.click(screen.getByText("Name"));
    expect(onSort).not.toHaveBeenCalled();
  });

  it("calls onSort with the column sortKey when a sortable head is activated", () => {
    const onSort = vi.fn();
    render(<SortableTableHeader columns={columns} onSort={onSort} />);

    fireEvent.click(screen.getByRole("button", { name: /Date/ }));
    expect(onSort).toHaveBeenCalledWith("date");
  });

  it("marks the active sortable column ascending or descending via aria-sort", () => {
    const { rerender } = render(
      <SortableTableHeader columns={columns} sortKey="amount" sortDirection="asc" />,
    );

    expect(
      screen.getByRole("columnheader", { name: /Amount/ }),
    ).toHaveAttribute("aria-sort", "ascending");

    rerender(
      <SortableTableHeader columns={columns} sortKey="amount" sortDirection="desc" />,
    );

    expect(
      screen.getByRole("columnheader", { name: /Amount/ }),
    ).toHaveAttribute("aria-sort", "descending");
  });

  it("leaves un-sorted columns without an aria-sort attribute", () => {
    render(<SortableTableHeader columns={columns} />);

    expect(
      screen.getByRole("columnheader", { name: /Date/ }),
    ).not.toHaveAttribute("aria-sort");
  });

  it("right-aligns columns configured with align end", () => {
    render(<SortableTableHeader columns={columns} />);

    expect(
      screen.getByRole("columnheader", { name: /Amount/ }),
    ).toHaveClass("text-end");
  });
});