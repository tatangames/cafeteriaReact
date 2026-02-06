import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { getRolesTable, borrarRolGlobal } from "../../services/api";
import { getToken } from "../../utils/auth";

import LoadingModal from "../../components/Loading/LoadingModal";
import ConfirmDeleteModal from "../../components/modal/ConfirmDeleteModal.tsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


interface Role {
  id: number;
  name: string;
}

export default function Roles() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  // Estados para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();


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

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await getRolesTable(token);

      const rolesArray: Role[] = Object.entries(response.roles).map(
          ([id, name]) => ({
            id: Number(id),
            name: name as string,
          })
      );

      setData(rolesArray);
    } catch (error) {
      console.error("Error cargando roles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: Role) => {
    navigate(`/admin/roles/${row.id}/permisos`, {
      state: {
        roleName: row.name,
      },
    });
  };

  const handleDeleteClick = (row: Role) => {
    setSelectedRole(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    setIsDeleting(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      await borrarRolGlobal(token, selectedRole.id);

      // Actualizar la tabla eliminando el rol borrado
      setData((prevData) => prevData.filter((role) => role.id !== selectedRole.id));

      // Cerrar el modal
      setIsDeleteModalOpen(false);
      setSelectedRole(null);

      toast.success("Rol eliminado exitosamente");
    } catch (error) {
      toast.error("Error al borrar");
      // Aquí puedes mostrar un mensaje de error al usuario
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: Role) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Rol",
      selector: (row: Role) => row.name,
      sortable: true,
    },
    {
      name: "Acciones",
      width: "180px",
      cell: (row: Role) => (
          <div className="flex justify-center gap-2">
            <button
                onClick={() => handleEdit(row)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
            >
              Editar
            </button>
            <button
                onClick={() => handleDeleteClick(row)}
                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
            >
              Eliminar
            </button>
          </div>
      ),
    }
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
            {/* Círculo de fondo gris completo */}
            <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="none"
            />
            {/* Arco azul (75% del círculo) */}
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
        <LoadingModal isOpen={loading} text="Cargando roles..." />

        <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Eliminar ROL"
            description={`Se eliminará el rol:`}
            itemName={selectedRole?.name || ""}
            isDeleting={isDeleting}
        />


        <div className="p-6">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Roles</h1>
            <p className="text-sm text-gray-500">
              {filteredData.length} roles en total
            </p>
          </div>

          {/* BUSCADOR */}
          <div className="flex justify-end mb-4">
            <div className="relative">
              <button
                  type="button"
                  tabIndex={-1}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                      fill="currentColor"
                  />
                </svg>
              </button>

              <input
                  type="text"
                  placeholder="Buscar..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="
                h-[42px] w-full xl:w-[300px]
                rounded-lg border border-gray-300
                bg-transparent
                py-2.5 pl-[42px] pr-4
                text-sm text-gray-800
                placeholder:text-gray-400
                focus:border-blue-400
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/10
                transition
              "
              />
            </div>
          </div>

          {/* TABLA */}
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
                paginationComponentOptions={{
                  rowsPerPageText: "Filas por página",
                  rangeSeparatorText: "de",
                  selectAllRowsItem: true,
                  selectAllRowsItemText: "Todos",
                }}
            />
          </div>
        </div>
      </>
  );
}