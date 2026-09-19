import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import useAuth from "@/hooks/useAuth";
import {
  addToWishlist as addToWishlistRequest,
  clearWishlist as clearWishlistRequest,
  getMyWishlist,
  removeFromWishlist as removeFromWishlistRequest,
} from "@/services/wishlist.service";
import useWishlist from "@/hooks/useWishlist";
import WishlistProvider from "@/contexts/WishlistProvider";

vi.mock("@/hooks/useAuth", () => ({ default: vi.fn() }));
vi.mock("@/services/wishlist.service", () => ({
  getMyWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
  clearWishlist: vi.fn(),
}));

const PRODUCT_A = { _id: "p1", name: "Wireless Headphones" };
const PRODUCT_B = { _id: "p2", name: "Mechanical Keyboard" };

function Consumer() {
  const {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  } = useWishlist();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error ? "error" : "ok"}</span>
      <span data-testid="items">
        {wishlistItems.map((item) => item._id).join(",")}
      </span>
      <span data-testid="has-p1">{String(isInWishlist("p1"))}</span>
      <button
        type="button"
        onClick={() => {
          addToWishlist(PRODUCT_A).catch(() => {});
        }}
      >
        add
      </button>
      <button
        type="button"
        onClick={() => {
          removeFromWishlist(PRODUCT_A._id).catch(() => {});
        }}
      >
        remove
      </button>
      <button
        type="button"
        onClick={() => {
          clearWishlist().catch(() => {});
        }}
      >
        clear
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <WishlistProvider>
      <Consumer />
    </WishlistProvider>,
  );
}

describe("WishlistProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch while the session is still loading", () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, isLoading: true });

    renderProvider();

    expect(getMyWishlist).not.toHaveBeenCalled();
    expect(screen.getByTestId("items")).toHaveTextContent("");
  });

  it("does not fetch for unauthenticated visitors", () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, isLoading: false });

    renderProvider();

    expect(getMyWishlist).not.toHaveBeenCalled();
    expect(screen.getByTestId("items")).toHaveTextContent("");
  });

  it("loads the wishlist once the user is authenticated", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockResolvedValueOnce([PRODUCT_A]);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("items")).toHaveTextContent("p1"),
    );
    expect(getMyWishlist).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("has-p1")).toHaveTextContent("true");
  });

  it("exposes a load error and leaves the list empty on failure", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockRejectedValueOnce(new Error("boom"));

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("error")).toHaveTextContent("error"),
    );
    expect(screen.getByTestId("items")).toHaveTextContent("");
  });

  it("adds optimistically and calls the API", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockResolvedValueOnce([]);
    addToWishlistRequest.mockResolvedValueOnce(null);

    renderProvider();

    await waitFor(() => expect(getMyWishlist).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "add" }));
    });

    expect(addToWishlistRequest).toHaveBeenCalledWith("p1");
    expect(screen.getByTestId("items")).toHaveTextContent("p1");
  });

  it("rolls back an optimistic add when the request fails", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockResolvedValueOnce([]);
    addToWishlistRequest.mockRejectedValueOnce(new Error("boom"));

    renderProvider();

    await waitFor(() => expect(getMyWishlist).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "add" }));
    });

    expect(screen.getByTestId("items")).toHaveTextContent("");
  });

  it("removes optimistically and calls the API", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockResolvedValueOnce([PRODUCT_A]);
    removeFromWishlistRequest.mockResolvedValueOnce(null);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("items")).toHaveTextContent("p1"),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "remove" }));
    });

    expect(removeFromWishlistRequest).toHaveBeenCalledWith("p1");
    expect(screen.getByTestId("items")).toHaveTextContent("");
  });

  it("clears the wishlist and restores it when the request fails", async () => {
    useAuth.mockReturnValue({
      user: { _id: "u1" },
      isAuthenticated: true,
      isLoading: false,
    });
    getMyWishlist.mockResolvedValueOnce([PRODUCT_A, PRODUCT_B]);
    clearWishlistRequest.mockRejectedValueOnce(new Error("boom"));

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("items")).toHaveTextContent("p1,p2"),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "clear" }));
    });

    expect(clearWishlistRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("items")).toHaveTextContent("p1,p2");
  });
});
