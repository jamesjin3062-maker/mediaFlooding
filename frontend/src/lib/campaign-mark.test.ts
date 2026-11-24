import { campaignInitials, campaignToneIndex } from "./campaign-mark";

it("builds a short mark from the brand name", () => {
  expect(campaignInitials("Northwind")).toBe("NO");
  expect(campaignInitials("Harbor Media")).toBe("HM");
  expect(campaignInitials("   ")).toBe("•");
});

it("keeps the same color for the same brand", () => {
  expect(campaignToneIndex("CocoBet")).toBe(campaignToneIndex("cocobet"));
  expect(campaignToneIndex("CocoBet")).toBeGreaterThanOrEqual(0);
  expect(campaignToneIndex("CocoBet")).toBeLessThan(8);
});
