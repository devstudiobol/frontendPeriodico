import { useQuery } from "@tanstack/react-query";
import { fetchCategories, Category } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return <CategoryChipsSkeleton />;
  }

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <ChipButton
            active={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          >
            Todas
          </ChipButton>
          {categories?.map((category) => (
            <ChipButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.descripcion}
            </ChipButton>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChipButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function ChipButton({ children, active, onClick }: ChipButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-chip-active text-chip-active-foreground shadow-sm"
          : "bg-chip text-chip-foreground hover:bg-chip/80"
      )}
    >
      {children}
    </button>
  );
}

function CategoryChipsSkeleton() {
  return (
    <div className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-9 rounded-full"
              style={{ width: `${60 + Math.random() * 40}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
