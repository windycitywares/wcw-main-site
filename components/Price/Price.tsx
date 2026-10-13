import { money } from "@/lib/format";

/** Price with an optional "was" price. `from` marks the lowest of several sizes. */
export function Price({
  amount,
  compareAt,
  currency = "USD",
  from = false,
  className,
}: {
  amount: number;
  compareAt?: number | null;
  currency?: string;
  from?: boolean;
  className?: string;
}) {
  const onSale = compareAt != null && compareAt > amount;
  return (
    <span className={className}>
      {from && <span>From </span>}
      <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>{money(amount, currency)}</span>
      {onSale && (
        <>
          {" "}
          <s style={{ color: "var(--color-steel)" }} aria-label={`was ${money(compareAt, currency)}`}>
            {money(compareAt, currency)}
          </s>
        </>
      )}
    </span>
  );
}
