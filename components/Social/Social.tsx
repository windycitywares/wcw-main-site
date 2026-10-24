import { socialOf, type SocialAccount } from "@/lib/social";
import styles from "./Social.module.css";

function Glyph({ platform, small }: { platform: string; small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={small ? styles.glyphSmall : styles.glyph}
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

/** The strip above the header: quiet icons that take the network's colour on hover. */
export function SocialBar({ accounts }: { accounts: SocialAccount[] }) {
  if (accounts.length === 0) return null;
  return (
    <div className={styles.bar}>
      <div className={`wrap ${styles.barInner}`}>
        <ul className={styles.icons} aria-label="Social media">
          {accounts.map((a) =>
            a.url === "#" ? (
              <li key={a.id}>
                <span role="img" aria-label={`${socialOf(a.platform).label}: coming soon`} title="Coming soon" className={`${styles.icon} ${styles.soon}`}>
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
      </div>
    </div>
  );
}

/** "Follow us" buttons with the handle, so visitors know what to search for. */
export function FollowPills({ accounts, onDark = false }: { accounts: SocialAccount[]; onDark?: boolean }) {
  if (accounts.length === 0) return null;
  return (
    <ul className={styles.pills} aria-label="Follow us">
      {accounts.map((a) =>
        a.url === "#" ? (
          <li key={a.id}>
            <span title="Coming soon" className={`${styles.pill} ${styles.soon} ${onDark ? styles.pillDark : ""}`}>
              <Glyph platform={a.platform} small />
              {a.handle || socialOf(a.platform).label}
              <small> · Coming soon</small>
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
            className={`${styles.pill} ${onDark ? styles.pillDark : ""}`}
          >
            <Glyph platform={a.platform} small />
            {a.handle || socialOf(a.platform).label}
          </a>
        </li>
        ),
      )}
    </ul>
  );
}
