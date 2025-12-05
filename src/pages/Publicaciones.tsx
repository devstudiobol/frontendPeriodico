import { Image as ImageIcon, FileText, Plus, Edit, Trash } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importar esto
import { ArrowLeft } from 'lucide-react'; // <--- Importar icono (opcional)

// --- Interfaces ---
interface Publicacion {
  id?: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagenUrl: string;
  idusuario: number;
  idcategoria: number;
  visualizacion?: number;
  estado?: string;
}

interface Categoria {
  id: number;
  descripcion: string;
}

// URL Base
const API_URL = 'https://periodicodb-1.onrender.com/api/Publicaciones';
const API_CATEGORIAS = 'https://periodicodb-1.onrender.com/api/Categorias';

const Publicaciones: React.FC = () => {
  // --- ESTADOS ---
   const navigate = useNavigate(); 
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPub, setEditingPub] = useState<Publicacion | null>(null);

  // --- ESTADO FALTANTE QUE CAUSABA EL ERROR ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // -------------------------------------------

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loggedUserId, setLoggedUserId] = useState<number>(1); 

  // Estado del formulario
  const [formData, setFormData] = useState<Publicacion>({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    imagenUrl: '',
    idusuario: 1, 
    idcategoria: 0
  });

  // --- Efectos ---
  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioId');
    if (storedUser) setLoggedUserId(parseInt(storedUser));
    fetchCategorias();
    fetchPublicaciones();
  }, []);

  // --- Funciones API ---
  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_CATEGORIAS}/ListarCategoriasActivos`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
        if (data.length > 0) {
           setFormData(prev => ({ ...prev, idcategoria: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error cargando categorías", error);
    }
  };

  const fetchPublicaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ListarPublicacionesActivos`);
      if (!response.ok) throw new Error('Error al listar');
      const data = await response.json();
      setPublicaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPublicaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPublicaciones(publicaciones.filter((p) => p.id !== id));
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Manejo de Archivos ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // Guardamos el archivo real para enviarlo luego
      setPreviewUrl(URL.createObjectURL(file)); // Para verlo en pantalla
    }
  };

  // --- GUARDAR (Crear / Editar) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.idcategoria) {
      alert("Título y Categoría son obligatorios");
      return;
    }

    try {
      let response;
      let result;

      // Usamos FormData porque tu backend usa [FromForm] y hay subida de archivos
      const dataToSend = new FormData();
      
      dataToSend.append('Titulo', formData.titulo);
      dataToSend.append('Descripcion', formData.descripcion || '');
      dataToSend.append('Fecha', formData.fecha);
      dataToSend.append('idcategoria', formData.idcategoria.toString());

      // Solo enviamos 'Imagen' si hay un archivo nuevo seleccionado
      if (selectedFile) {
        dataToSend.append('Imagen', selectedFile); 
      }
      // Si no hay archivo nuevo, no enviamos nada en 'Imagen' y tu backend respeta la anterior.

      if (editingPub && editingPub.id) {
        // --- EDITAR ---
        // Ruta: /api/Publicaciones/Actualizar/{id}
        const urlEditar = `${API_URL}/Actualizar/${editingPub.id}`;
        console.log("Editando en:", urlEditar);

        response = await fetch(urlEditar, {
          method: 'PUT',
          body: dataToSend
        });

        if (!response.ok) {
           const errorText = await response.text();
           console.error("Error Backend Editar:", errorText);
           throw new Error('Error al actualizar');
        }
        
        // Actualizar vista local
        const updatedPub = { 
            ...formData, 
            id: editingPub.id,
            imagenUrl: previewUrl || editingPub.imagenUrl 
        };
        setPublicaciones(publicaciones.map(p => (p.id === editingPub.id ? updatedPub : p)));

      } else {
        // --- CREAR ---
        // Ruta: /api/Publicaciones/Crear
        dataToSend.append('idusuario', loggedUserId.toString()); // Crear pide usuario

        const urlCrear = `${API_URL}/Crear`; 
        console.log("Creando en:", urlCrear);

        response = await fetch(urlCrear, {
          method: 'POST',
          body: dataToSend
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error Backend Crear:", errorText);
            throw new Error('Error al crear');
        }
        
        result = await response.json();
        
        if (result) {
            setPublicaciones([...publicaciones, result]);
        } else {
            fetchPublicaciones(); 
        }
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert('Error al guardar. Revisa la consola.');
    }
  };

  // --- Modales ---
  const openAddModal = () => {
    setEditingPub(null);
    setPreviewUrl('');
    setSelectedFile(null); // Limpiamos el archivo seleccionado
    setFormData({
      titulo: '',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      imagenUrl: '',
      idusuario: loggedUserId,
      idcategoria: categorias.length > 0 ? categorias[0].id : 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pub: Publicacion) => {
    setEditingPub(pub);
    setPreviewUrl(pub.imagenUrl); 
    setSelectedFile(null); // Limpiamos selección anterior
    setFormData({ ...pub });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPub(null);
    setSelectedFile(null);
  };

  const getNombreCategoria = (idCat: number) => {
    const cat = categorias.find(c => c.id == idCat);
    return cat ? cat.descripcion : 'ID: ' + idCat;
  };

  return (
   <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- ENCABEZADO MODIFICADO --- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Publicaciones
          </h1>

          <div className="flex gap-3"> {/* Contenedor para agrupar los botones */}
            {/* Botón Volver */}
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>

            {/* Tu Botón Agregar existente */}
            <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={20} /> Nueva Publicación
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Imagen</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoría</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Cargando...</td></tr>
                ) : publicaciones.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-500">No hay publicaciones.</td></tr>
                ) : (
                  publicaciones.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-5 border-b border-gray-200">
                        <img 
                          src={(pub.imagenUrl && pub.imagenUrl.startsWith('http')) ? pub.imagenUrl : 'https://via.placeholder.com/50'} 
                          alt="img" 
                          className="w-12 h-12 object-cover rounded-md border"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50')} 
                        />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm font-medium text-gray-900">{pub.titulo}</td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <span className="px-2 py-1 font-semibold text-blue-900 bg-blue-100 rounded-full text-xs">
                          {getNombreCategoria(pub.idcategoria)}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-500">
                        {pub.fecha ? pub.fecha.substring(0, 10) : ''}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openEditModal(pub)} className="text-indigo-600 hover:text-indigo-900"><Edit size={20} /></button>
                          <button onClick={() => pub.id && handleDelete(pub.id)} className="text-red-600 hover:text-red-900"><Trash size={20} /></button>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingPub ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Título */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  required
                />
              </div>

              {/* Categoría (Select) */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                <select
                  value={formData.idcategoria}
                  onChange={(e) => setFormData({...formData, idcategoria: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none  text-black bg-white"
                >
                  <option value={0}>Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha ? formData.fecha.substring(0, 10) : ''}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none  text-black"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24  text-black"
                />
              </div>

              {/* Imagen (Archivo) */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                  <ImageIcon size={16} /> Imagen
                </label>
                
                {/* Input de archivo */}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    mb-2"
                />

                {/* Previsualización */}
                {previewUrl && (
                  <div className="mt-2 relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border">
                    <img 
                      src={previewUrl} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">
                  {editingPub ? 'Guardar Cambios' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicaciones;