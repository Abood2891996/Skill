import Link from "next/link";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-subtle">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-fg-muted">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="transition-colors hover:text-fg">
                    {c.name}
                  </Link>
                  <span aria-hidden="true" className="h-px w-3 bg-line-strong" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
