import { accountStatusNote, canSubmitAccount, parseAccountList } from "./clipstake-accounts";

it("keeps an unknown platform and blocks submit until the account is connected", () => {
  const [account] = parseAccountList({
    data: [{
      id: "acct_1c2d3e4f5a6b4c7d8e9f0a1b2c3d4e5f",
      platform: "tiktok",
      handle: "northwind",
      status: "connected",
      followers_count: null,
      viewer_locations_available: null,
      connected_at: "2026-09-02T10:15:00.000Z",
    }],
    next_cursor: null,
  });
  expect(account.platform).toBe("tiktok");
  expect(canSubmitAccount(account)).toBe(false);
  expect(accountStatusNote(account)).toMatch(/cannot submit/i);
});

it("explains a missing viewer-country reading on a connected Instagram account", () => {
  const note = accountStatusNote({
    platform: "instagram",
    status: "connected",
    viewer_locations_available: false,
  });
  expect(note).toMatch(/viewer countries/);
  expect(canSubmitAccount({ platform: "instagram", status: "reconnect_needed" })).toBe(false);
});
