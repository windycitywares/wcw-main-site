"use client";

import { useState } from "react";
import styles from "./NewsletterForm.module.css";

type State = { kind: "idle" | "sending" | "done" | "error"; message?: string };

/** Email signup. Posts to /api/newsletter, which forwards to the shop API. */
export function NewsletterForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string };
      setState(res.ok ? { kind: "done", message: data.message } : { kind: "error", message: data.message });
    } catch {
      setState({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <p className={styles.done} role="status">
        {state.message || "You're subscribed. Watch your inbox for new designs."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate={false}>
      <label htmlFor="newsletter-email" className={styles.label}>
        Email address
      </label>
      <div className={styles.row}>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={`field ${styles.input}`}
        />
        <button type="submit" className="btn btn-gold" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state.kind === "error" && (
        <p className={styles.error} role="alert">
          {state.message || "That didn't work. Please try again."}
        </p>
      )}
    </form>
  );
}
