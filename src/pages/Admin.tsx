import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
interface User {
  id: number;
  nombre: string;
  nombreUsuario: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
      toast({
        title: "Acceso denegado",
        description: "Debe iniciar sesión para acceder al panel",
        variant: "destructive",
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Panel de Administración
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Hola, <span className="text-foreground font-medium">{user.nombre}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="font-serif text-xl font-semibold mb-2">Publicaciones</h2>
            <p className="text-muted-foreground text-sm">Gestionar artículos y noticias</p>
                  <Link 
            to="/publicaciones" 
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-block"
        >
            Ver Publicaciones
        </Link>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="font-serif text-xl font-semibold mb-2">Categorías</h2>
            <p className="text-muted-foreground text-sm">Administrar categorías</p>
                  <Link 
            to="/category" 
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-block"
        >
            Ver Categorias
        </Link>
          </div>
   <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="font-serif text-xl font-semibold mb-2">Usuarios</h2>
        <p className="text-muted-foreground text-sm mb-4">Gestionar usuarios del sistema</p>

        <Link 
            to="/users" 
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-block"
        >
            Ver Usuarios
        </Link>
    </div>
        </div>
      </main>
    </div>
  );
}
