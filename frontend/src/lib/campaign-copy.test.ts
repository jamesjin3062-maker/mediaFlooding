import { campaignCopyKey, parseCampaignCopy } from "./campaign-copy";

it("turns Clipstake rich text into paragraphs and bold words", () => {
  const blocks = parseCampaignCopy(
    '<p dir="ltr" style="border-color: rgb(231, 229, 228);"><b style="background-color: rgba(0, 0, 0, 0);">Allowed content formats:&nbsp;</b></p><div>UFC clips: knockouts</div>',
  );
  expect(blocks).toEqual([
    { nodes: [{ text: "Allowed content formats:", bold: true }] },
    { nodes: [{ text: "UFC clips: knockouts", bold: false }] },
  ]);
});

it("keeps plain instructions as text", () => {
  expect(parseCampaignCopy("Show the bag in the first 3 seconds.")).toEqual([
    { nodes: [{ text: "Show the bag in the first 3 seconds.", bold: false }] },
  ]);
});

it("drops scripts and treats the same copy as one body", () => {
  const html = "<p>Hello</p><script>alert(1)</script>";
  expect(campaignCopyKey(html)).toBe("Hello");
  expect(campaignCopyKey(html)).toBe(campaignCopyKey("<div>Hello</div>"));
});
