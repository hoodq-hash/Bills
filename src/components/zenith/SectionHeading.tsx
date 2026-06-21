interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-14 ${alignClass}`}>
      <p className="section-eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-display font-light italic text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
        {title}{" "}
        <span className="text-elite-gold">{highlight}</span>
      </h2>
      {subtitle && (
        <p className="mt-5 font-sans text-elite-muted text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
