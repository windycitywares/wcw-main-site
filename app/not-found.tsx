import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingTop: "5rem", display: "grid", gap: "1rem", justifyItems: "start" }}>
      <h1 className="display" style={{ fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
        We couldn&rsquo;t find that page
      </h1>
      <p className="lead">The link may be old, or the design may no longer be available.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/products" className="btn">
          Browse all designs
        </Link>
        <Link href="/" className="btn btn-ghost">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
