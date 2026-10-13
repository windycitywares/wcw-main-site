import { forward } from "@/lib/forward";

/** Contact form → shop API (/contact), which emails the message to WindyCityWares. */
export async function POST(req: Request) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return Response.json({ message: "Please fill in the form." }, { status: 400 });
  const str = (k: string) => (typeof data[k] === "string" ? (data[k] as string).trim() : "");
  return forward(
    req,
    "/contact",
    {
      name: str("name"),
      email: str("email"),
      subject: str("subject"),
      message: str("message"),
      order_number: str("order_number") || null,
      website: str("website") || null,
      captcha_token: str("captcha_token") || null,
      locale: "en",
    },
    "Thank you. Your message has been sent and we'll reply by email.",
  );
}
