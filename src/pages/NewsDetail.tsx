import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, Share2 } from "lucide-react";
import { fetchPublicationById } from "@/lib/api";
import { getSmartDateLabel } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: publication, isLoading, error } = useQuery({
    queryKey: ["publication", id],
    queryFn: () => fetchPublicationById(Number(id)),
    enabled: !!id,
  });

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(publication?.titulo + " " + currentUrl)}`,
      "_blank"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 container py-6">
          <div className="max-w-3xl mx-auto">
            <div className="skeleton-shimmer h-8 w-24 rounded mb-6" />
            <div className="skeleton-shimmer aspect-video rounded-lg mb-6" />
            <div className="skeleton-shimmer h-10 w-3/4 rounded mb-4" />
            <div className="skeleton-shimmer h-4 w-48 rounded mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-4 w-full rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 container py-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No se pudo cargar la noticia
          </p>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const dateLabel = getSmartDateLabel(publication.fecha);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 container py-6 animate-fade-in">
        <article className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          {/* Featured image */}
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={publication.imagenUrl}
              alt={publication.titulo}
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Header info */}
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {publication.categoria && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {publication.categoria.nombre}
                </span>
              )}
              <span className="text-sm text-muted-foreground">{dateLabel}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {publication.visualizacion} vistas
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
              {publication.titulo}
            </h1>
          </header>

          {/* Share section */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-secondary rounded-lg">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium mr-2">Compartir:</span>
            <Button
              onClick={shareWhatsApp}
              size="sm"
              className="bg-whatsapp hover:bg-whatsapp/90 text-white"
            >
              WhatsApp
            </Button>
            <Button
              onClick={shareFacebook}
              size="sm"
              className="bg-facebook hover:bg-facebook/90 text-white"
            >
              Facebook
            </Button>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {publication.descripcion}
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
