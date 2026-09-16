import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useProfile from "./useProfile";
import { fetchProfile } from "../api/profileApi";

// بنقول لـ vitest: "استبدل الملف ده بالكامل بنسخة وهمية"
vi.mock("../api/profileApi", () => ({
  fetchProfile: vi.fn(),
  updateProfile: vi.fn(),
}));

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("يبدأ بحالة loading", () => {
    fetchProfile.mockReturnValue(new Promise(() => {})); // Promise معلق (مايردش خالص)

    const { result } = renderHook(() => useProfile());

    expect(result.current.status).toBe("loading");
  });

  it("يرجع success ويحط بيانات اليوزر لو الـ API نجح", async () => {
    const fakeUser = { _id: "1", username: "ahmed", email: "a@test.com" };
    fetchProfile.mockResolvedValue(fakeUser);

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.user).toEqual(fakeUser);
  });

  it("يرجع unauthorized لو الـ API رجع 401", async () => {
    fetchProfile.mockRejectedValue({ status: 401 });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.status).toBe("unauthorized");
    });
  });

  it("يرجع error لو الـ API فشل بسبب تاني غير 401", async () => {
    fetchProfile.mockRejectedValue({ status: 500 });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });
  });
});