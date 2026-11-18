import { campaignMembership, membershipLabel, parseCampaignList, SAMPLE_CAMPAIGNS } from "./clipstake";

it("labels sample campaigns the way the board shows them", () => {
  expect(membershipLabel(campaignMembership(SAMPLE_CAMPAIGNS[0]))).toBe("No active campaigns");
  expect(membershipLabel(campaignMembership(SAMPLE_CAMPAIGNS[1]))).toBe("Application pending");
  expect(membershipLabel(campaignMembership(SAMPLE_CAMPAIGNS[3]))).toBe("Apply to join");
});

it("reads a Clipstake campaign list", () => {
  const campaigns = parseCampaignList({
    data: [{
      id: "cmp_8a1d4e2f6b7c4d9e8f0a1b2c3d4e5f60",
      name: "Autumn Roast Launch",
      slug: "autumn-roast-launch",
      brand_name: "Northwind Coffee",
      status: "active",
      about: "Short clips.",
      instructions: "Show the bag.",
      invite_only: false,
      invite_accepted: false,
      platforms: [{ platform: "instagram", cpm_cents: 100 }],
      geo_enabled: false,
      max_payout_per_clip_cents: 40000,
      platform_fee_bps: 2000,
      max_clips: 50,
      clip_count: 3,
      start_date: "2026-09-15T00:00:00.000Z",
      end_date: null,
      launched_at: "2026-09-15T09:00:00.000Z",
    }],
    next_cursor: null,
  });
  expect(campaigns).toHaveLength(1);
  expect(campaignMembership(campaigns[0])).toBe("open");
  expect(campaigns[0].banner).toMatch(/\.svg$/);
});
