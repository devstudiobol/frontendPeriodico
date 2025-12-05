import { useState, useRef } from "react";
import { Search, Sun, Moon, Type } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import logoDark from "@/assets/logo-dark.jpg";
import logoLight from "@/assets/logo-light.png";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { theme, toggleTheme, largeText, toggleLargeText } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current === 3) {
      setShowLogin(true);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex-shrink-0 focus:outline-none transition-transform hover:scale-105"
            aria-label="El Bicentenario"
          >
            <img
              src={theme === "dark" ? logoLight : logoDark}
              alt="El Bicentenario"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLargeText}
              className={largeText ? "bg-secondary" : ""}
              aria-label="Cambiar tamaño de texto"
            >
              <Type className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
}
