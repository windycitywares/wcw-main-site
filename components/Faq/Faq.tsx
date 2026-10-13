import styles from "./Faq.module.css";

export type FaqItem = { q: string; a: React.ReactNode };

/** FAQ accordion built on <details>, so it works without JavaScript and with a keyboard. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary className={styles.q}>
            <span>{item.q}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.a}>{item.a}</div>
        </details>
      ))}
    </div>
  );
}
