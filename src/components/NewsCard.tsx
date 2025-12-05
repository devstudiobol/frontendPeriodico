import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Publication } from "@/lib/api";
import { getSmartDateLabel } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  publication: Publication;
  variant?: "hero" | "featured" | "default";
}

export function NewsCard({ publication, variant = "default" }: NewsCardProps) {
  const dateLabel = getSmartDateLabel(publication.fecha);

  return (
    <Link
      to={`/noticia/${publication.id}`}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden border border-border transition-all duration-300",
        "hover:shadow-lg hover:border-primary/20 hover:-translate-y-1",
        variant === "hero" && "md:col-span-2 md:row-span-2"
      )}
    >
      <article className={cn(
        "h-full flex flex-col",
        variant === "hero" && "md:flex-row"
      )}>
        <div className={cn(
          "relative overflow-hidden",
          variant === "hero" ? "md:w-1/2 aspect-[16/9] md:aspect-auto" : "aspect-[16/9]"
        )}>
          <img
            src={publication.imagenUrl}
            alt={publication.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {publication.categoria && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
              {publication.categoria.nombre}
            </span>
          )}
        </div>

        <div className={cn(
          "flex flex-col flex-1 p-4",
          variant === "hero" && "md:w-1/2 md:p-6 md:justify-center"
        )}>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className={cn(
              "font-medium",
              dateLabel === "Subida hoy" && "text-primary"
            )}>
              {dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {publication.visualizacion}
            </span>
          </div>

          <h3 className={cn(
            "font-serif font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors",
            variant === "hero" ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {publication.titulo}
          </h3>

          <p className={cn(
            "text-muted-foreground text-sm mt-2 line-clamp-2",
            variant === "hero" && "md:line-clamp-3"
          )}>
            {publication.descripcion}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function NewsCardSkeleton({ variant = "default" }: { variant?: "hero" | "featured" | "default" }) {
  return (
    <div className={cn(
      "bg-card rounded-lg overflow-hidden border border-border",
      variant === "hero" && "md:col-span-2 md:row-span-2"
    )}>
      <div className={cn(
        "flex flex-col h-full",
        variant === "hero" && "md:flex-row"
      )}>
        <div className={cn(
          "skeleton-shimmer",
          variant === "hero" ? "md:w-1/2 aspect-[16/9] md:aspect-auto md:min-h-[300px]" : "aspect-[16/9]"
        )} />
        <div className={cn(
          "p-4 flex flex-col gap-3 flex-1",
          variant === "hero" && "md:p-6 md:justify-center"
        )}>
          <div className="skeleton-shimmer h-3 w-24 rounded" />
          <div className="skeleton-shimmer h-6 w-full rounded" />
          <div className="skeleton-shimmer h-6 w-3/4 rounded" />
          <div className="skeleton-shimmer h-4 w-full rounded mt-1" />
        </div>
      </div>
    </div>
  );
}
