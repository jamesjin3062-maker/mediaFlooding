import { postAuthPath, signInPath } from "./auth-redirect";

describe("postAuthPath", () => {
  it("follows a same-site path", () => {
    expect(postAuthPath("?next=/settings/creator-program")).toBe("/settings/creator-program");
  });

  it.each(["", "?next=", "?next=https://evil.example", "?next=//evil.example", "?next=/\\evil.example", "?next=settings"])(
    "falls back to home for %j",
    (search) => {
      expect(postAuthPath(search)).toBe("/create");
    },
  );

  it("uses the sign-up fallback when no safe next path is present", () => {
    expect(postAuthPath("", "/dashboard")).toBe("/dashboard");
    expect(postAuthPath("?next=/wallet", "/dashboard")).toBe("/wallet");
  });
});

describe("signInPath", () => {
  it("round-trips a path with its query", () => {
    const path = "/tasks/abc/edit?clip=c1";
    const url = signInPath(path);
    expect(url.startsWith("/sign-in?next=")).toBe(true);
    expect(postAuthPath(url.slice(url.indexOf("?")))).toBe(path);
  });
});
