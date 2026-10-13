"use client";

import { useState } from "react";
import { Turnstile } from "./Turnstile";
import styles from "./ContactForm.module.css";

type State = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

/** Contact form. Posts to /api/contact, which forwards it to the shop API (the API emails it to us). */
export function ContactForm({ siteKey, defaultSubject = "" }: { siteKey: string | null; defaultSubject?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (siteKey && !token) {
      setState({ kind: "error", message: "Please complete the security check above the Send button." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captcha_token: token }),
      });
      const body = (await res.json()) as { message?: string };
      if (res.ok) {
        form.reset();
        setState({ kind: "sent", message: body.message });
      } else {
        setState({ kind: "error", message: body.message });
        setResetKey((k) => k + 1); // security-check tokens are single-use
      }
    } catch {
      setState({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
      setResetKey((k) => k + 1);
    }
  }

  if (state.kind === "sent") {
    return (
      <div className={styles.sent} role="status">
        <h2 className={styles.sentTitle}>Message sent</h2>
        <p>{state.message || "Thank you. We'll reply to you by email."}</p>
        <button type="button" className="btn btn-ghost" onClick={() => setState({ kind: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.two}>
        <div>
          <label className="label" htmlFor="c-name">Your name</label>
          <input id="c-name" name="name" required maxLength={200} autoComplete="name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-subject">Subject</label>
        <input id="c-subject" name="subject" required maxLength={200} defaultValue={defaultSubject} className="field" />
      </div>
      <div>
        <label className="label" htmlFor="c-order">
          Order number <span className={styles.optional}>(optional)</span>
        </label>
        <input id="c-order" name="order_number" maxLength={32} className="field" />
      </div>
      <div>
        <label className="label" htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} rows={6} className="field" />
      </div>
      {/* Honeypot: hidden from people, bots fill it in */}
      <div aria-hidden="true" className={styles.trap}>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile siteKey={siteKey} onToken={setToken} resetKey={resetKey} />

      {state.kind === "error" && (
        <p className={styles.error} role="alert">
          {state.message || "Your message wasn't sent. Please try again."}
        </p>
      )}
      <div>
        <button type="submit" className="btn" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
