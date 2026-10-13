import "server-only";
import { postToApi } from "./api";

/** Turns an API reply into a short message for the visitor. */
export function messageFrom(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  // FastAPI validation errors: [{ loc: [...,"email"], msg: "..." }]
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { loc?: unknown[]; msg?: string };
    const field = String(first.loc?.[first.loc.length - 1] ?? "");
    const names: Record<string, string> = {
      email: "Please enter a valid email address.",
      message: "Please write a message of at least 10 characters.",
      name: "Please enter your name.",
      subject: "Please enter a subject.",
    };
    return names[field] || fallback;
  }
  return fallback;
}

export function visitorIp(req: Request): string | null {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
}

export async function forward(req: Request, path: string, body: unknown, okFallback: string) {
  const res = await postToApi(path, body, visitorIp(req));
  const status = res.ok ? 200 : res.status >= 500 ? 502 : res.status;
  const message = res.ok
    ? messageFrom(res.detail, okFallback)
    : messageFrom(res.detail, res.status >= 500 ? "Our server had a problem. Please try again in a few minutes." : "Please check the form and try again.");
  return Response.json({ message }, { status });
}
