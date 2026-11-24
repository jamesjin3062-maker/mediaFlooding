export type CampaignCopyNode = { text: string; bold: boolean };

export type CampaignCopyBlock = { nodes: CampaignCopyNode[] };

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entity, body: string) => {
    if (body.startsWith("#")) {
      const code = body[1] === "x" || body[1] === "X" ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
  });
}

function inlineNodes(value: string): CampaignCopyNode[] {
  const nodes: CampaignCopyNode[] = [];
  const pattern = /<(\/?)(b|strong)>/gi;
  let bold = false;
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    const text = decodeEntities(value.slice(cursor, index));
    if (text) nodes.push({ text, bold });
    bold = match[1] !== "/";
    cursor = index + match[0].length;
  }
  const tail = decodeEntities(value.slice(cursor));
  if (tail) nodes.push({ text: tail, bold });
  return nodes;
}

function trimNodes(nodes: CampaignCopyNode[]): CampaignCopyNode[] {
  const copy = nodes.map((node) => ({ ...node }));
  if (copy[0]) copy[0].text = copy[0].text.replace(/^\s+/, "");
  const last = copy.at(-1);
  if (last) last.text = last.text.replace(/\s+$/, "");
  return copy.filter((node) => node.text.length > 0);
}

/** Turn Clipstake's rich-text HTML into paragraphs. The result is text, not markup. */
export function parseCampaignCopy(value: string): CampaignCopyBlock[] {
  const source = value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "• ")
    .replace(/<(?:b|strong)\b[^>]*>/gi, "<b>")
    .replace(/<\/(?:b|strong)>/gi, "</b>")
    .replace(/<(?!\/?b>)[^>]+>/gi, "");

  return source.split(/\n+/).flatMap((paragraph) => {
    const nodes = trimNodes(inlineNodes(paragraph));
    return nodes.length > 0 ? [{ nodes }] : [];
  });
}

export function campaignCopyKey(value: string): string {
  return parseCampaignCopy(value)
    .map((block) => block.nodes.map((node) => node.text).join(""))
    .join("\n");
}
