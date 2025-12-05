import { Tags as TagsIcon } from 'lucide-react'; // Cambié el icono a "Tags"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importar esto
import { ArrowLeft } from 'lucide-react'; // <--- Importar icono (opcional)

// --- Definición de Tipos ---
interface Categoria {
  id?: number | string;
  descripcion: string;
}

// URL Base para Categorías
const API_URL = 'https://periodicodb-1.onrender.com/api/Categorias';

const Categorys: React.FC = () => {
  // --- Estados ---
   const navigate = useNavigate(); 
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  // Estado del formulario (Solo descripción)
  const [formData, setFormData] = useState<Categoria>({
    descripcion: ''
  });

  // --- Efectos ---
  useEffect(() => {
    fetchCategorias();
  }, []);

  // --- Funciones API ---

  // 1. Obtener Categorías (GET)
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      // Asumimos que el endpoint sigue el mismo patrón: /ListarCategoriasActivas
      // Si falla, prueba cambiarlo a '/Listar' o solo '/'
      const response = await fetch(`${API_URL}/ListarCategoriasActivos`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      alert('Error obteniendo los datos. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Eliminar Categoría (DELETE)
  const handleDelete = async (id: number | string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategorias(categorias.filter((cat) => cat.id !== id));
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar:", errorText);
        alert('Error al eliminar la categoría.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al eliminar.');
    }
  };

  // 3. Guardar Categoría (POST o PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcion) {
      alert("Por favor completa la descripción");
      return;
    }

    try {
      let response;
      let result;

      // 1. Preparamos los datos base para la URL (Solo descripción)
      const paramsBase = {
        descripcion: formData.descripcion
      };

      if (editingCategoria && editingCategoria.id) {
        // --- MODO EDITAR (PUT) ---
        
        // Agregamos el ID a los parámetros por si el backend lo pide
        const paramsEditar = new URLSearchParams({
            ...paramsBase,
            id: editingCategoria.id.toString() 
        }).toString();

        // Construimos URL: /Actualizar?id=...&descripcion=...
        const urlEditar = `${API_URL}/Actualizar?${paramsEditar}`;

        console.log("Editando en URL:", urlEditar); 

        response = await fetch(urlEditar, {
          method: 'PUT', // Si da error 405, cambia a 'POST'
          headers: { 'Accept': '*/*' },
          body: null // Datos en URL
        });

        if (!response.ok) {
           const errorText = await response.text();
           console.error("Error Backend Editar:", errorText);
           throw new Error('Error al actualizar');
        }

        // Actualizamos en la lista local
        const updatedCat = { ...formData, id: editingCategoria.id };
        setCategorias(categorias.map(c => (c.id === editingCategoria.id ? updatedCat : c)));

      } else {
        // --- MODO AGREGAR (POST) ---
        
        const paramsCrear = new URLSearchParams(paramsBase).toString();
        // Construimos URL: /Crear?descripcion=...
        const urlCrear = `${API_URL}/Crear?${paramsCrear}`;
        
        console.log("Creando en URL:", urlCrear);

        response = await fetch(urlCrear, {
          method: 'POST',
          headers: { 'Accept': '*/*' },
          body: null
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error Backend Crear:", errorText);
            throw new Error('Error al crear categoría');
        }

        result = await response.json();
        setCategorias([...categorias, result]);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert('Error al guardar. Revisa la consola.');
    }
  };

  // --- Manejadores del Modal ---
  const openAddModal = () => {
    setEditingCategoria(null);
    setFormData({ descripcion: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Categoria) => {
    setEditingCategoria(cat);
    setFormData({ ...cat }); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <TagsIcon className="w-8 h-8" />
            Gestión de Categorías
          </h1>

          {/* Agrupamos los botones para que queden juntos a la derecha */}
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>

            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">Cargando datos...</td>
                  </tr>
                ) : categorias.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-gray-500">No hay categorías registradas.</td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">{cat.descripcion}</div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button
                            onClick={() => cat.id && handleDelete(cat.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  placeholder="Ej: Deportes"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingCategoria ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorys;