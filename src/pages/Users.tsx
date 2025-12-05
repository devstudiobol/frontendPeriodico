import { Users as UsersIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importar esto
import { ArrowLeft } from 'lucide-react'; // <--- Importar icono (opcional)




interface User {
  id?: number | string;
  nombre: string;
  telefono: string;
  nombreUsuario: string;
  password?: string;
}

// URL Base
const API_URL = 'https://periodicodb-1.onrender.com/api/Usuarios';

const Users: React.FC = () => {
    const navigate = useNavigate(); 
  // --- Estados ---
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<User>({
    nombre: '',
    telefono: '',
    nombreUsuario: '',
    password: ''
  });

  // --- Efectos ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Funciones API ---

  // 1. Obtener Usuarios (GET)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Usamos la ruta específica que indicaste
      const response = await fetch(`${API_URL}/ListarUsuariosActivos`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert('Error obteniendo los datos. Revisa la consola (F12).');
    } finally {
      setLoading(false);
    }
  };

  // 2. Eliminar Usuario (DELETE)
  const handleDelete = async (id: number | string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar:", errorText);
        alert('Error al eliminar el usuario.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al eliminar.');
    }
  };

  // 3. Guardar Usuario (POST o PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.nombreUsuario) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      let response;
      let result;

      // 1. Preparamos los datos base para la URL (igual que hiciste en Crear)
      const telNumber = formData.telefono ? parseInt(formData.telefono) : 0;
      
      const paramsBase = {
        nombre: formData.nombre,
        telefono: telNumber.toString(),
        nombreusuario: formData.nombreUsuario, 
        password: formData.password || ''
      };

      if (editingUser && editingUser.id) {
  
        const paramsEditar = new URLSearchParams({
            ...paramsBase,
            id: editingUser.id.toString() 
        }).toString();

     
        const urlEditar = `${API_URL}/Actualizar?${paramsEditar}`;

        console.log("Editando en URL:", urlEditar); 

        response = await fetch(urlEditar, {
          method: 'PUT', 
          headers: { 'Accept': '*/*' },
          body: null 
        });

        if (!response.ok) {
           const errorText = await response.text();
           console.error("Error Backend Editar:", errorText);
           throw new Error('Error al actualizar');
        }

   
        const updatedUser = { ...formData, id: editingUser.id };
        setUsers(users.map(u => (u.id === editingUser.id ? updatedUser : u)));

      } else {
        const paramsCrear = new URLSearchParams(paramsBase).toString();
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
            throw new Error('Error al crear usuario');
        }

        result = await response.json();
        setUsers([...users, result]);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert('Error al guardar. Revisa la consola (F12).');
    }
  };
  // --- Manejadores del Modal ---
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ nombre: '', telefono: '', nombreUsuario: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ ...user }); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">

{/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UsersIcon className="w-8 h-8" />
            Gestión de Usuarios
          </h1>

          {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
          {/* Agrupamos los botones en un div con 'flex gap-3' para que estén juntos */}
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
              {/* Icono Plus SVG manual */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Agregar Usuario
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
                    Nombre
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">Cargando datos...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">{user.nombre}</div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{user.telefono}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                          <span className="relative">{user.nombreUsuario}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-500">
                        {user.password}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                             {/* Icono Edit SVG manual */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button
                            onClick={() => user.id && handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            {/* Icono Trash SVG manual */}
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

      {/* --- MODAL (AGREGAR / EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  placeholder="Ej: Juan Perez"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  placeholder="Ej: 777-123456"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  placeholder="Ej: jperez"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  placeholder="Contraseña"
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
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;