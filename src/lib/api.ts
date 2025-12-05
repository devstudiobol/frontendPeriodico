const BASE_URL = "https://periodicodb-1.onrender.com";

export interface Category {
  id: number;
  descripcion: string;
  estado?: string;
}

export interface Publication {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  fecha: string;
  visualizacion: number;
  categoriaId?: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  estado?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/api/Categorias/ListarCategoriasActivos`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function fetchAllPublications(): Promise<Publication[]> {
  const response = await fetch(`${BASE_URL}/api/Publicaciones/ListarPublicacionesActivos`);
  if (!response.ok) throw new Error("Failed to fetch publications");
  return response.json();
}

export async function fetchPublicationsByCategory(categoryId: number): Promise<Publication[]> {
  const response = await fetch(
    `${BASE_URL}/api/Publicaciones/ListarPorCategoria/${categoryId}?estado=Activo`
  );
  if (!response.ok) throw new Error("Failed to fetch publications by category");
  return response.json();
}

export async function fetchPublicationById(id: number): Promise<Publication> {
  const response = await fetch(`${BASE_URL}/api/Publicaciones/${id}`);
  if (!response.ok) throw new Error("Failed to fetch publication");
  return response.json();
}
