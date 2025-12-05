import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const BASE_URL = "https://periodicodb-1.onrender.com";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor ingrese usuario y contraseña",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/Usuarios/Login?nombreUsuario=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreUsuario: username,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // API returns an array - extract user from index 0, or use object directly
        let userData = null;
        if (Array.isArray(data) && data.length > 0) {
          userData = data[0];
        } else if (data && typeof data === "object" && data.id) {
          userData = data;
        }
        
        if (userData && userData.id) {
          // Store user in localStorage
          localStorage.setItem("adminUser", JSON.stringify(userData));
          
          toast({
            title: "Bienvenido",
            description: `Bienvenido, ${userData.nombre || username}`,
          });
          
          onOpenChange(false);
          setUsername("");
          setPassword("");
          navigate("/admin");
        } else {
          toast({
            title: "Error de autenticación",
            description: "Credenciales incorrectas",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Acceso Administrador
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
