INSERT INTO "announcements" ("id", "title", "description", "href", "action", "is_published", "published_at")
VALUES
(
    'submissions-2026-11',
    'Submissions are on one page',
    E'Clip links you submit are listed together.\n\nFilter by pending, approved, or denied. Search by the link, the caption, or the page.',
    '/submissions',
    'Open submissions',
    true,
    '2026-11-24T16:00:00Z'
),
(
    'ad-offers-2026-11',
    'Ad offers have their own page',
    E'When a brand offers to run a paid ad on a verified page, it shows up under Ad Offers.\n\nThe rate card is where a price can be set for a post or a video.',
    '/social-pr',
    'Open ad offers',
    true,
    '2026-11-22T16:00:00Z'
),
(
    'bounties-2026-11',
    'Bounties are open',
    E'Fixed-reward briefs are listed as cards.\n\nOpen a card for the brief, the reward, and how many spots are left.',
    '/bounties',
    'Browse bounties',
    true,
    '2026-11-19T16:00:00Z'
),
(
    'wallet-2026-11',
    'Wallet is ready to review',
    E'Available balance and payout activity live on the Wallet page.\n\nPayout setup stays on that page. Nothing is sent until setup is connected.',
    '/wallet',
    'Open wallet',
    true,
    '2026-11-12T16:00:00Z'
)
ON CONFLICT ("id") DO NOTHING;
