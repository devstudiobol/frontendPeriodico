import { useQuery } from "@tanstack/react-query";
import { fetchAllPublications, fetchPublicationsByCategory, Publication } from "@/lib/api";
import { sortByDateDesc } from "@/lib/date-utils";
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard";

interface NewsFeedProps {
  selectedCategory: number | null;
  searchQuery: string;
}

export function NewsFeed({ selectedCategory, searchQuery }: NewsFeedProps) {
  const { data: publications, isLoading } = useQuery({
    queryKey: ["publications", selectedCategory],
    queryFn: () =>
      selectedCategory === null
        ? fetchAllPublications()
        : fetchPublicationsByCategory(selectedCategory),
  });

  const filteredPublications = publications
    ? sortByDateDesc(
        publications.filter((pub) => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            pub.titulo.toLowerCase().includes(query) ||
            pub.descripcion.toLowerCase().includes(query)
          );
        })
      )
    : [];

  if (isLoading) {
    return <NewsFeedSkeleton isMagazineMode={selectedCategory === null} />;
  }

  if (filteredPublications.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground text-lg">
          {searchQuery
            ? "No se encontraron resultados para tu búsqueda"
            : "No hay noticias disponibles"}
        </p>
      </div>
    );
  }

  // Magazine mode for "Todas"
  if (selectedCategory === null) {
    return (
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPublications.map((pub, index) => (
            <NewsCard
              key={pub.id}
              publication={pub}
              variant={index === 0 ? "hero" : index < 3 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    );
  }

  // Uniform grid for category view
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPublications.map((pub) => (
          <NewsCard key={pub.id} publication={pub} />
        ))}
      </div>
    </div>
  );
}

function NewsFeedSkeleton({ isMagazineMode }: { isMagazineMode: boolean }) {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <NewsCardSkeleton
            key={i}
            variant={isMagazineMode && i === 0 ? "hero" : "default"}
          />
        ))}
      </div>
    </div>
  );
}
