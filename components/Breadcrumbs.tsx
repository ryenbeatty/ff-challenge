import Link from "next/link";
import type { ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs text-slate-500">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1 || !item.href;
          let content: ReactNode = (
            <span aria-current="page" className="max-w-[32ch] truncate text-slate-700">
              {item.label}
            </span>
          );

          if (item.href && !isCurrent) {
            const href: string = item.href;
            content = (
              <Link href={href} className="max-w-[24ch] truncate hover:text-slate-700">
                {item.label}
              </Link>
            );
          }

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {content}
              {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
