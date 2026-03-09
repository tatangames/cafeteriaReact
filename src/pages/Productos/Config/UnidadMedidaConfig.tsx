import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import {
  getUnidadMedidaTable,
  crearUnidadMedida,
  actualizarUnidadMedida,
} from "../../../services/api";
import { getToken } from "../../../utils/auth";

import LoadingModal from "../../../components/Loading/LoadingModal";
import EntidadNombreModal from "../../../components/modal/EntidadNombreModal";
import EntidadNombreEstadoModal from "../../../components/modal/EntidadNombreEstadoModal";

interface UnidadMedida {
  id: number;
  nombre: string;
  estado: boolean;
}

export default function UnidadMedidaConfig() {
  const [data, setData] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedUnidad, setSelectedUnidad] = useState<UnidadMedida | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await getUnidadMedidaTable(token);
      setData(response);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar unidades de medida");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (nombre: string) => {
    setIsCreating(true);
    try {
      const token = getToken();
      const response = await crearUnidadMedida(token!, { nombre });

      toast.success(response.message || "Unidad de medida creada correctamente");
      setIsCreateModalOpen(false);
      fetchUnidades();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        toast.error((firstError as string[])[0]);
      } else {
        toast.error(error.response?.data?.message || "Error al crear unidad de medida");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number, data: { nombre: string; estado: boolean }) => {
    setIsUpdating(true);
    try {
      const token = getToken();
      const response = await actualizarUnidadMedida(token!, id, data);

      toast.success(response.message || "Unidad de medida actualizada correctamente");
      setIsEditModalOpen(false);
      setSelectedUnidad(null);
      fetchUnidades();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        toast.error((firstError as string[])[0]);
      } else {
        toast.error(error.response?.data?.message || "Error al actualizar unidad de medida");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = (row: UnidadMedida) => {
    setSelectedUnidad(row);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      name: "ID",
      selector: (row: UnidadMedida) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre",
      selector: (row: UnidadMedida) => row.nombre,
      sortable: true,
    },
    {
      name: "Estado",
      width: "120px",
      sortable: true,
      cell: (row: UnidadMedida) => (
          <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  row.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
          {row.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      width: "120px",
      cell: (row: UnidadMedida) => (
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
        <LoadingModal isOpen={loading} text="Cargando unidades de medida..." />

        <EntidadNombreModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onConfirm={handleCreate}
            isLoading={isCreating}
            title="Nueva Unidad de Medida"
            placeholder="Nombre de la unidad"
            maxLength={100}
        />

        {selectedUnidad && (
            <EntidadNombreEstadoModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedUnidad(null);
                }}
                onConfirm={(data) => handleUpdate(selectedUnidad.id, data)}
                isLoading={isUpdating}
                title="Editar Unidad de Medida"
                initialNombre={selectedUnidad.nombre}
                initialEstado={selectedUnidad.estado}
                maxLength={100}
            />
        )}

        <div className="p-6">
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-3">
              <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                + Crear Unidad de Medida
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Unidades de Medida
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredData.length} unidades en total
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <input
                type="text"
                placeholder="Buscar..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="h-[42px] w-[300px] rounded-lg border border-gray-300 px-4 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
            />
          </div>

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