// components/Breadcrumb.tsx
"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumbs separator={<ChevronRight className="h-4 w-4" />}>
      <BreadcrumbItem>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      {items.map((item) => (
        <BreadcrumbItem key={`${item.label}-${item.href ?? "static"}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

