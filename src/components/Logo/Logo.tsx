import Image from "next/image";
import Link from "next/link";
import { SITE_LOGO } from "@/constants/site";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-10 w-[8.5rem]",
  md: "h-14 md:h-16 w-[11rem] md:w-[14rem]",
  lg: "h-20 md:h-24 w-[14rem] md:w-[18rem]",
};

export default function Logo({
  href = "/",
  size = "md",
  className = "",
  priority = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`relative block shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={SITE_LOGO}
        alt="Elite Notes — Quality Banknotes"
        fill
        priority={priority}
        quality={95}
        sizes="(max-width: 768px) 176px, 224px"
        className="object-contain object-left"
      />
    </Link>
  );
}
