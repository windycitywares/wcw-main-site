import { forward } from "@/lib/forward";

/** Newsletter signup → shop API (/newsletter). */
export async function POST(req: Request) {
  const data = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  if (!email) return Response.json({ message: "Please enter your email address." }, { status: 400 });
  return forward(req, "/newsletter", { email }, "You're subscribed. Watch your inbox for new designs.");
}
