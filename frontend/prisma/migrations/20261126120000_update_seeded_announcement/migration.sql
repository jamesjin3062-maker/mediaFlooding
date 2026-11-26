UPDATE "announcements"
SET
    "title" = 'Campaigns are open',
    "description" = 'Open campaigns are ready for clips. Review a brief, post it, and submit the link.',
    "href" = '/announcements',
    "action" = 'View announcements',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'creator-program-2026-10'
  AND "title" = 'The creator program is open';
