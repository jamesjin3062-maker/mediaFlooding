import { parseCampaignCopy } from "@/lib/campaign-copy";
import { cn } from "@/lib/utils";

export function CampaignCopy({ value, className }: { value: string; className?: string }) {
  const blocks = parseCampaignCopy(value);
  if (blocks.length === 0) return null;
  return (
    <div className={cn("space-y-2 text-sm leading-6", className)}>
      {blocks.map((block, index) => (
        <p key={index}>
          {block.nodes.map((node, nodeIndex) => (
            node.bold
              ? <strong key={nodeIndex} className="font-semibold text-white">{node.text}</strong>
              : <span key={nodeIndex}>{node.text}</span>
          ))}
        </p>
      ))}
    </div>
  );
}
