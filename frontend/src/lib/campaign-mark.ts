const TONE_COUNT = 8;

function hashName(name: string): number {
  let hash = 0;
  for (const char of name.trim().toLowerCase() || "campaign") hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}

export function campaignToneIndex(name: string): number {
  return hashName(name) % TONE_COUNT;
}

export function campaignInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}
