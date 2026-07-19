import { ChatWidget } from "@/components/chat-widget/chat-widget";

// Public, visitor-facing widget surface. Embeddable via an iframe or opened
// directly as a live preview. Display options come from the URL so no extra
// public endpoint is needed (the owner's embed snippet bakes them in).
export default async function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicKey: string }>;
  searchParams: Promise<{
    color?: string;
    name?: string;
    position?: string;
    capability?: string;
    greeting?: string;
  }>;
}) {
  const { publicKey } = await params;
  const sp = await searchParams;
  const position =
    sp.position === "bottom-left" ? "bottom-left" : "bottom-right";
  const capability =
    sp.capability === "voice" || sp.capability === "both"
      ? sp.capability
      : "chat";

  return (
    <main className="min-h-screen bg-transparent">
      <ChatWidget
        publicKey={publicKey}
        name={sp.name || "Assistant"}
        color={sp.color || "#2563eb"}
        position={position}
        capability={capability}
        greeting={sp.greeting}
      />
    </main>
  );
}
