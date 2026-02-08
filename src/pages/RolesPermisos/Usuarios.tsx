import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import { getUsuariosTable, crearUsuario, actualizarAdministrador } from "../../services/api";
import { getToken } from "../../utils/auth";

import LoadingModal from "../../components/Loading/LoadingModal";
import NuevoUsuarioModal from "../../components/modal/NuevoUsuarioModal.tsx";
import EditarUsuarioModal from "../../components/modal/Editarusuariomodal.tsx";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: boolean;
}

interface NuevoUsuarioForm {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

interface EditarUsuarioForm {
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  estado: boolean;
}

export default function Usuarios() {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await getUsuariosTable(token);
      setData(response);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: Usuario) => {
    setSelectedUsuarioId(row.id);
    setIsEditModalOpen(true);
  };

  const handleCreateUsuario = async (form: NuevoUsuarioForm) => {
    setIsCreating(true);
    try {
      const token = getToken();
      const response = await crearUsuario(token!, form);

      toast.success(response.message || "Usuario creado correctamente");
      setIsNewUserModalOpen(false);
      fetchUsuarios();
    } catch (error: any) {
      console.error("Error completo:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];

        if (Array.isArray(firstError) && firstError.length > 0) {
          toast.error(firstError[0] as string);
        } else {
          toast.error("Error de validación");
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear usuario");
      }

      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUsuario = async (id: number, form: EditarUsuarioForm) => {
    setIsUpdating(true);
    try {
      const token = getToken();
      const response = await actualizarAdministrador(token!, id, form);

      toast.success(response.message || "Usuario actualizado correctamente");
      setIsEditModalOpen(false);
      setSelectedUsuarioId(null);
      fetchUsuarios();
    } catch (error: any) {
      console.error("Error completo:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];

        if (Array.isArray(firstError) && firstError.length > 0) {
          toast.error(firstError[0] as string);
        } else {
          toast.error("Error de validación");
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar usuario");
      }

      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: Usuario) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre",
      selector: (row: Usuario) => row.nombre,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row: Usuario) => row.rol,
      sortable: true,
      width: "150px",
    },
    {
      name: "Correo",
      selector: (row: Usuario) => row.correo,
    },
    {
      name: "Estado",
      width: "120px",
      sortable: true,
      cell: (row: Usuario) => (
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            row.estado
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      width: "120px",
      cell: (row: Usuario) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
          >
            Editar
          </button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.correo.toLowerCase().includes(filterText.toLowerCase()) ||
      item.rol.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <LoadingModal isOpen={loading} text="Cargando usuarios..." />

      {/* MODAL NUEVO USUARIO */}
      <NuevoUsuarioModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onConfirm={handleCreateUsuario}
        isCreating={isCreating}
      />

      {/* MODAL EDITAR USUARIO */}
      <EditarUsuarioModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUsuarioId(null);
        }}
        onConfirm={handleUpdateUsuario}
        usuarioId={selectedUsuarioId}
        isUpdating={isUpdating}
      />

      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setIsNewUserModalOpen(true)}
              className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              + Crear Usuario
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Usuarios
              </h1>
              <p className="text-sm text-gray-500">
                {filteredData.length} usuarios en total
              </p>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="
              h-[42px] w-[300px]
              rounded-lg border border-gray-300
              px-4 text-sm text-gray-800
              focus:border-blue-400 focus:outline-none
              focus:ring-2 focus:ring-blue-500/10
              transition
            "
          />
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            striped
            highlightOnHover
            responsive
            noDataComponent={
              <div className="py-6 text-sm text-gray-500">
                No hay registros para mostrar
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}