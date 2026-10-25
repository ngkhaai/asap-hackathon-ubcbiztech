import { createFileRoute } from "@tanstack/react-router";
import { Prototype } from "@/components/proto/Prototype";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASAP · Low-stock transfer prototype" },
      { name: "description", content: "Flag low stock, pick the best transfer option, approve and track it in SAP S/4HANA." },
      { property: "og:title", content: "ASAP · Low-stock transfer prototype" },
      { property: "og:description", content: "Flag, pick, approve and track a stock transfer in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Prototype,
});
