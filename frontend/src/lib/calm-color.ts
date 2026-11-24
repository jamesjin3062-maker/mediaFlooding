/** Soft, low-saturation colors. Hue stays away from red and neon green. */
export const calm = {
  sage: {
    surface: "bg-[oklch(0.94_0.028_155)] text-[oklch(0.36_0.04_155)] dark:bg-[oklch(0.30_0.025_155)] dark:text-[oklch(0.86_0.03_155)]",
    dot: "bg-[oklch(0.48_0.05_155)] dark:bg-[oklch(0.75_0.04_155)]",
    text: "text-[oklch(0.40_0.04_155)] dark:text-[oklch(0.82_0.03_155)]",
  },
  mist: {
    surface: "bg-[oklch(0.94_0.025_235)] text-[oklch(0.36_0.04_235)] dark:bg-[oklch(0.30_0.025_235)] dark:text-[oklch(0.86_0.03_235)]",
    dot: "bg-[oklch(0.48_0.05_235)] dark:bg-[oklch(0.75_0.04_235)]",
    text: "text-[oklch(0.40_0.04_235)] dark:text-[oklch(0.82_0.03_235)]",
  },
  sand: {
    surface: "bg-[oklch(0.95_0.028_95)] text-[oklch(0.38_0.04_95)] dark:bg-[oklch(0.31_0.025_95)] dark:text-[oklch(0.86_0.03_95)]",
    dot: "bg-[oklch(0.50_0.05_95)] dark:bg-[oklch(0.78_0.04_95)]",
    text: "text-[oklch(0.42_0.04_95)] dark:text-[oklch(0.84_0.03_95)]",
  },
  lilac: {
    surface: "bg-[oklch(0.94_0.025_295)] text-[oklch(0.38_0.04_295)] dark:bg-[oklch(0.30_0.025_295)] dark:text-[oklch(0.86_0.03_295)]",
  },
  sea: {
    surface: "bg-[oklch(0.94_0.025_195)] text-[oklch(0.36_0.04_195)] dark:bg-[oklch(0.30_0.025_195)] dark:text-[oklch(0.86_0.03_195)]",
  },
  slate: {
    surface: "bg-[oklch(0.93_0.012_260)] text-[oklch(0.36_0.02_260)] dark:bg-[oklch(0.30_0.015_260)] dark:text-[oklch(0.86_0.02_260)]",
  },
} as const;

export const calmMarks = [
  calm.sage.surface,
  calm.mist.surface,
  calm.sea.surface,
  calm.lilac.surface,
  calm.sand.surface,
  calm.slate.surface,
] as const;

export function platformTone(platform: string): string {
  if (platform === "instagram") return calm.mist.surface;
  if (platform === "x") return calm.slate.surface;
  return calm.sage.surface;
}
