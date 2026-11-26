export const ANNOUNCEMENTS_READ_EVENT = "supoclip:announcements-read";

const memoryRead = new Map<string, string[]>();

export function announcementReadKey(userId?: string) {
  return `supoclip:announcements-read:${userId ?? "visitor"}`;
}

export function forgetAnnouncementReadCache(userId?: string) {
  memoryRead.delete(announcementReadKey(userId));
}

export function readAnnouncementIds(userId?: string): string[] {
  const key = announcementReadKey(userId);
  if (memoryRead.has(key)) return memoryRead.get(key)!;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return memoryRead.get(key) ?? [];
  }
}

export function markAnnouncementsRead(userId: string | undefined, ids: string[]) {
  if (ids.length === 0) return;
  const key = announcementReadKey(userId);
  const next = [...new Set([...readAnnouncementIds(userId), ...ids])];
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
    memoryRead.delete(key);
  } catch {
    memoryRead.set(key, next);
  }
  window.dispatchEvent(new Event(ANNOUNCEMENTS_READ_EVENT));
}
