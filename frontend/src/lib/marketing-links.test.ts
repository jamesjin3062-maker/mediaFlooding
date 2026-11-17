import { getRelatedMarketingLinks, marketingLinks } from "./marketing-links";

const removed = [
  "/faq",
  "/affiliate",
  "/ai-video-clipper",
  "/open-source-video-clipper",
  "/youtube-shorts-clipper",
  "/blog/podcast-to-shorts",
  "/blog/find-best-moments-in-video",
  "/blog/twitch-vod-to-shorts",
  "/blog/repurpose-webinar-clips",
  "/blog/word-by-word-video-captions",
  "/blog/schedule-week-of-youtube-shorts",
  "/blog/open-source-video-clippers",
];

describe("marketing link registry", () => {
  const hrefs = new Set(marketingLinks.map((link) => link.href));

  it("keeps the demo and drops removed pages", () => {
    expect(hrefs).toContain("/demo");
    for (const href of removed) expect(hrefs, href).not.toContain(href);
    expect(hrefs.size).toBe(marketingLinks.length);
  });

  it("only relates a page to other registered pages, never itself", () => {
    for (const link of marketingLinks) {
      expect(link.related, link.href).not.toContain(link.href);
      expect(getRelatedMarketingLinks(link.href), link.href).toHaveLength(link.related.length);
    }
  });
});
