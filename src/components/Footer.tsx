import { Facebook, Mail, Phone } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import logoLight from "@/assets/logo-light.png";

export function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={logoLight}
              alt="El Bicentenario"
              className="h-16 w-auto opacity-90"
            />
            <div>
              <h3 className="font-serif text-xl font-semibold">El Bicentenario</h3>
              <p className="text-sm text-footer-foreground/70">
                Tu fuente de noticias confiable
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <a
              href="tel:67379136"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              67379136
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <a
              href="mailto:contacto@elbicentenario.com"
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contacto
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-footer-foreground/20 text-center text-xs text-footer-foreground/60">
          © {new Date().getFullYear()} El Bicentenario. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
