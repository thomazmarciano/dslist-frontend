"use client";

import Link, { LinkProps } from "next/link";
import { useLoading } from "./LoadingProvider";

interface LoadingLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // Adicione esta linha
}

export function LoadingLink({
  children,
  className,
  onClick,
  ...linkProps
}: LoadingLinkProps) {
  const { setIsLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented) {
      setIsLoading(true);
    }
  };

  return (
    <Link {...linkProps} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
