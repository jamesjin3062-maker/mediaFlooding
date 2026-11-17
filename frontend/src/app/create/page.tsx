import { noIndexMetadata } from "@/lib/seo";

import { CreateApp } from "./create-app";

export const metadata = noIndexMetadata;

export default function CreatePage() {
  return <CreateApp />;
}
