import { getTranslations } from "next-intl/server";

import { SectionPage } from "./section-page";

export async function WorkspacePage({ titleKey, bodyKey }: { titleKey: string; bodyKey: string }) {
  const t = await getTranslations("shell");
  return <SectionPage title={t(`workspace.${titleKey}`)} body={t(`workspace.${bodyKey}`)} />;
}
