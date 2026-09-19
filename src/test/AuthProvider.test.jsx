import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import AuthProvider from "@/contexts/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { getCurrentUser, deleteCurrentUser } from "@/features/auth/auth.service";

vi.mock("@/features/auth/auth.service", () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  getCurrentUser: vi.fn(),
  updateCurrentUser: vi.fn(),
  deleteCurrentUser: vi.fn(),
}));

const USER = {
  _id: "u1",
  username: "tester",
  email: "t@example.com",
  role: "customer",
};

function Consumer({ onDeleteError }) {
  const { user, isLoading, deleteAccount } = useAuth();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user">{user ? user._id : "none"}</span>
      <button
        type="button"
        data-testid="delete"
        onClick={() => {
          deleteAccount().catch(onDeleteError ?? (() => {}));
        }}
      >
        delete
      </button>
    </div>
  );
}

describe("AuthProvider.deleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue({ user: USER });
    vi.mocked(deleteCurrentUser).mockResolvedValue({});
  });

  it("clears the session only after a successful deletion", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("u1")
    );

    act(() => {
      screen.getByTestId("delete").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("none")
    );

    expect(getCurrentUser).toHaveBeenCalled();
    expect(deleteCurrentUser).toHaveBeenCalledWith(USER._id);
  });

  it("keeps the session when deletion fails and rethrows", async () => {
    vi.mocked(deleteCurrentUser).mockRejectedValueOnce(new Error("boom"));
    const onDeleteError = vi.fn(() => {});

    render(
      <AuthProvider>
        <Consumer onDeleteError={onDeleteError} />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("u1")
    );

    act(() => {
      screen.getByTestId("delete").click();
    });

    await waitFor(() => expect(onDeleteError).toHaveBeenCalled());

    expect(screen.getByTestId("user").textContent).toBe("u1");
    expect(deleteCurrentUser).toHaveBeenCalledWith(USER._id);
    expect(onDeleteError).toHaveBeenCalledWith(expect.any(Error));
  });
});