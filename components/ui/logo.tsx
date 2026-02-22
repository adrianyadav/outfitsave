import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer" | "default";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  const isHeader = variant === "header";

  return (
    <Link
      href="/"
      className={`font-[var(--font-f-lausanne-500)] tracking-[-0.03em] ${isHeader ? "text-2xl md:text-[32px]" : "text-xl"} font-medium hover:opacity-80 transition-opacity ${className}`}
    >
      unpacked
    </Link>
  );
}
