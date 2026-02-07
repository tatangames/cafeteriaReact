import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import toast from "react-hot-toast";

import {
  getPermisosTable,
  borrarPermisoGlobal,
  crearNuevoPermiso,
} from "../../services/api";

import { getToken } from "../../utils/auth";
import LoadingModal from "../../components/Loading/LoadingModal";
import ConfirmDeleteModal from "../../components/modal/ConfirmDeleteModal";
import NuevoPermisoModal from "../../components/modal/NuevoPermisoModal";

interface Permiso {
  id: number;
  name: string;
}

export default function PermisosTodos() {
  const [data, setData] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  // eliminar
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // agregar
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPermisos();
  }, []);

  const fetchPermisos = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await getPermisosTable(token);
      setData(response.permisos);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando permisos");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ELIMINAR ================= */

  const handleDeleteClick = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPermiso) return;

    setIsDeleting(true);
    try {
      const token = getToken();
      await borrarPermisoGlobal(token!, selectedPermiso.id);

      setData((prev) =>
        prev.filter((p) => p.id !== selectedPermiso.id)
      );

      toast.success("Permiso eliminado correctamente");
      setIsDeleteOpen(false);
    } catch {
      toast.error("No se pudo eliminar el permiso");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= AGREGAR ================= */

  const handleCreatePermiso = async (nombre: string) => {
    setIsCreating(true);
    try {
      const token = getToken();
      const res = await crearNuevoPermiso(token!, nombre);

      if (res.success === 1) {
        toast.success("Permiso creado correctamente");
        setIsAddOpen(false);
        fetchPermisos();

      } else if (res.success === 2) {
        toast.error(`El permiso "${res.permiso}" ya existe`);
      } else {
        toast.error("Error al crear permiso");
      }

    } catch (error: any) {
      // por si viene directo como error HTTP 409
      const permiso = error?.response?.data?.permiso;
      if (permiso) {
        toast.error(`El permiso "${permiso}" ya existe`);
      } else {
        toast.error("Error al crear permiso");
      }
    } finally {
      setIsCreating(false);
    }
  };

  /* ================= TABLA ================= */

  const columns: TableColumn<Permiso>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "80px",
      sortable: true,
    },
    {
      name: "Permiso",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Acciones",
      width: "180px",
      cell: (row) => (
        <button
          onClick={() => handleDeleteClick(row)}
          className="px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition"
        >
          Eliminar global
        </button>
      ),
    },
  ];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <LoadingModal isOpen={loading} text="Cargando permisos..." />

      {/* MODAL ELIMINAR */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => !isDeleting && setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Permiso"
        description="Se eliminará el permiso:"
        itemName={selectedPermiso?.name || ""}
        isDeleting={isDeleting}
      />

      {/* MODAL AGREGAR */}
      <NuevoPermisoModal
        isOpen={isAddOpen}
        onClose={() => !isCreating && setIsAddOpen(false)}
        onConfirm={handleCreatePermiso}
        isCreating={isCreating}
      />

      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Permisos
            </h1>
            <p className="text-sm text-gray-500">
              {filteredData.length} permisos en total
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            + Agregar Permiso
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar permiso..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="
              h-[42px] w-[300px]
              rounded-lg border border-gray-300
              px-4 text-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/20
            "
          />
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={10}
            striped
            highlightOnHover
            responsive
            noDataComponent={
              <div className="py-6 text-sm text-gray-500">
                No hay registros para mostrar
              </div>
            }
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página",
              rangeSeparatorText: "de",
            }}
          />
        </div>
      </div>
    </>
  );
}
