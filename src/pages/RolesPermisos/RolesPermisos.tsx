import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import {
    getRolePermissionsTable,
    borrarPermisoRol,
} from "../../services/api";
import { getToken } from "../../utils/auth";

import LoadingModal from "../../components/Loading/LoadingModal";
import ConfirmDeleteModal from "../../components/modal/ConfirmDeleteModal";

interface Permiso {
    id: number;
    name: string;
}

export default function RolesPermisos() {
    const { id } = useParams();
    const location = useLocation();
    const roleName = location.state?.roleName ?? "";

    const [data, setData] = useState<Permiso[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    // modal delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPermisos();
    }, []);

    const fetchPermisos = async () => {
        try {
            const token = getToken();
            if (!token) throw new Error("Token no encontrado");

            const response = await getRolePermissionsTable(token, Number(id));
            setData(response.permisos);
        } catch (error) {
            console.error("Error cargando permisos", error);
            toast.error("Error cargando permisos");
        } finally {
            setLoading(false);
        }
    };

    // abrir modal
    const handleDelete = (permiso: Permiso) => {
        setSelectedPermiso(permiso);
        setIsDeleteModalOpen(true);
    };

    // confirmar eliminación
    const handleConfirmDelete = async () => {
        if (!selectedPermiso) return;

        setIsDeleting(true);
        try {
            const token = getToken();
            if (!token) throw new Error("Token no encontrado");

            await borrarPermisoRol(token, Number(id), selectedPermiso.id);

            setData((prev) =>
              prev.filter((p) => p.id !== selectedPermiso.id)
            );

            toast.success("Permiso eliminado correctamente");

            setIsDeleteModalOpen(false);
            setSelectedPermiso(null);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el permiso");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseModal = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSelectedPermiso(null);
        }
    };

    const customStyles = {
        table: {
            style: {
                borderRadius: "12px",
                overflow: "visible",
            },
        },
        headRow: {
            style: {
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                minHeight: "48px",
            },
        },
        headCells: {
            style: {
                fontSize: "12px",
                fontWeight: "700",
                color: "#1F2937",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
            },
        },
        rows: {
            style: {
                fontSize: "14px",
                color: "#374151",
                minHeight: "52px",
                borderBottom: "1px solid #F1F5F9",
            },
            stripedStyle: {
                backgroundColor: "#E3F0FF",
            },
            highlightOnHoverStyle: {
                backgroundColor: "#356FA3",
                color: "#FFFFFF",
                cursor: "pointer",
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid #E5E7EB",
                minHeight: "56px",
            },
        },
    };

    const columns = [
        {
            name: "ID",
            selector: (row: Permiso) => row.id,
            width: "80px",
            sortable: true,
        },
        {
            name: "Permiso",
            selector: (row: Permiso) => row.name,
            sortable: true,
        },
        {
            name: "Opciones",
            width: "160px",
            cell: (row: Permiso) => (
              <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(row)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition"
                  >
                      Eliminar
                  </button>
              </div>
            ),
        },
    ];

    const TableSpinner = () => (
      <div className="flex justify-center py-10">
          <div className="animate-spin">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="94.2 31.4"
                    strokeLinecap="round"
                  />
              </svg>
          </div>
      </div>
    );

    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
      <>
          <LoadingModal isOpen={loading} text="Cargando permisos..." />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            title="Quitar Permiso"
            description="Se eliminará el permiso"
            itemName={selectedPermiso?.name || ""}
            isDeleting={isDeleting}
          />

          <div className="p-6">
              <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">
                      Permisos del Rol
                  </h1>
                  <p className="text-sm text-gray-500">
                      Rol: <strong>{roleName}</strong>
                  </p>
              </div>

              {/* BUSCADOR */}
              <div className="flex justify-end mb-4">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="h-[42px] w-[300px] rounded-lg border border-gray-300 bg-transparent px-4 text-sm focus:border-blue-400 focus:outline-none"
                  />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={loading}
                    progressComponent={<TableSpinner />}
                    pagination
                    paginationPerPage={10}
                    striped
                    highlightOnHover
                    responsive
                    customStyles={customStyles}
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