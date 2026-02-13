import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import {
  getCategoriasTable,
  crearCategoria,
  actualizarCategoria,
} from "../../../services/api";
import { getToken } from "../../../utils/auth";

import LoadingModal from "../../../components/Loading/LoadingModal";
import EntidadNombreModal from "../../../components/modal/EntidadNombreModal";
import EntidadNombreEstadoModal from "../../../components/modal/EntidadNombreEstadoModal";

interface Categoria {
  id: number;
  nombre: string;
  estado: boolean;
}

export default function CategoriasConfig() {
  const [data, setData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await getCategoriasTable(token);
      setData(response);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      CREAR CATEGORIA
     ========================= */
  const handleCreateCategoria = async (nombre: string) => {
    setIsCreating(true);
    try {
      const token = getToken();
      const response = await crearCategoria(token!, { nombre });

      toast.success(response.message || "Categoría creada correctamente");
      setIsCreateModalOpen(false);
      fetchCategorias();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        toast.error((firstError as string[])[0]);
      } else {
        toast.error(error.response?.data?.message || "Error al crear categoría");
      }
    } finally {
      setIsCreating(false);
    }
  };

  /* =========================
      EDITAR CATEGORIA
     ========================= */
  const handleUpdateCategoria = async (
    id: number,
    data: { nombre: string; estado: boolean }
  ) => {
    setIsUpdating(true);
    try {
      const token = getToken();
      const response = await actualizarCategoria(token!, id, data);

      toast.success(response.message || "Categoría actualizada correctamente");
      setIsEditModalOpen(false);
      setSelectedCategoria(null);
      fetchCategorias();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        toast.error((firstError as string[])[0]);
      } else {
        toast.error(error.response?.data?.message || "Error al actualizar categoría");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = (row: Categoria) => {
    setSelectedCategoria(row);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      name: "ID",
      selector: (row: Categoria) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre",
      selector: (row: Categoria) => row.nombre,
      sortable: true,
    },
    {
      name: "Estado",
      width: "120px",
      sortable: true,
      cell: (row: Categoria) => (
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
      cell: (row: Categoria) => (
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

  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <LoadingModal isOpen={loading} text="Cargando categorías..." />

      {/* MODAL CREAR */}
      <EntidadNombreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateCategoria}
        isLoading={isCreating}
        title="Nueva Categoría"
        placeholder="Nombre de la categoría"
        maxLength={100}
      />

      {/* MODAL EDITAR */}
      {selectedCategoria && (
        <EntidadNombreEstadoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategoria(null);
          }}
          onConfirm={(data) =>
            handleUpdateCategoria(selectedCategoria.id, data)
          }
          isLoading={isUpdating}
          title="Editar Categoría"
          initialNombre={selectedCategoria.nombre}
          initialEstado={selectedCategoria.estado}
          maxLength={100}
        />
      )}

      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              + Crear Categoría
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Categorías
              </h1>
              <p className="text-sm text-gray-500">
                {filteredData.length} categorías en total
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
