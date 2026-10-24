import { socialOf, type SocialAccount } from "@/lib/social";
import styles from "./Social.module.css";

function Glyph({ platform }: { platform: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={styles.glyph}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: socialOf(platform).glyph }}
    />
  );
}

const colour = (platform: string) => ({ "--social-hover": socialOf(platform).hover }) as React.CSSProperties;

/** Quiet icons for the header: ink-coloured until hovered, when each takes its network's colour. 44px tap targets. */
export function SocialIcons({ accounts, className = "" }: { accounts: SocialAccount[]; className?: string }) {
  if (accounts.length === 0) return null;
  return (
    <ul className={`${styles.icons} ${className}`} aria-label="Social media">
      {accounts.map((a) =>
        a.url === "#" ? (
          <li key={a.id}>
            <span role="img" aria-label={`${socialOf(a.platform).label}: coming soon`} title="Coming soon" className={`${styles.icon} ${styles.iconSoon}`}>
              <Glyph platform={a.platform} />
            </span>
          </li>
        ) : (
          <li key={a.id}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${socialOf(a.platform).label} (opens in a new tab)`}
              style={colour(a.platform)}
              className={styles.icon}
            >
              <Glyph platform={a.platform} />
            </a>
          </li>
        ),
      )}
    </ul>
  );
}

/** The Follow us row inside the dark footer, in the same tile pattern as the marketplaces: a badge in the network's own
 *  colour, the handle and where it is. Five to a row on wide screens. A # address is shown greyed out as Coming soon. */
export function FollowBand({ accounts }: { accounts: SocialAccount[] }) {
  if (accounts.length === 0) return null;
  return (
    <section className={styles.band} aria-labelledby="follow-heading">
      <div className="wrap">
        <h2 id="follow-heading" className={styles.title}>
          Follow us
        </h2>
        <p className={styles.intro}>See new designs, behind-the-scenes and offers first.</p>
        <ul className={styles.tiles}>
          {accounts.map((a) => {
            const p = socialOf(a.platform);
            const soon = a.url === "#";
            const inner = (
              <>
                <span aria-hidden="true" className={styles.badge} style={{ background: p.hover }}>
                  <Glyph platform={a.platform} />
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{a.handle || p.label}</span>
                  <span className={styles.sub}>{soon ? "Coming soon" : `on ${p.label}`}</span>
                </span>
              </>
            );
            return (
              <li key={a.id}>
                {soon ? (
                  <div className={`${styles.tile} ${styles.soon}`} style={{ borderLeftColor: p.hover }}>
                    {inner}
                  </div>
                ) : (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${p.label} (opens in a new tab)`}
                    className={styles.tile}
                    style={{ borderLeftColor: p.hover }}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
