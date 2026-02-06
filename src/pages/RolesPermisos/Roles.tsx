import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { getRolesTable } from "../../services/api";
import { getToken } from "../../utils/auth";
import RowActions from "../../components/tablas/RowActions.tsx";

interface Role {
  id: number;
  name: string;
}

export default function Roles() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");


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
        fontWeight: "600",
        color: "#6B7280",
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
      name: "",
      width: "64px",
      center: true,
      cell: (row: Role) => (
        <RowActions
          onViewDetail={() => console.log("Detalle completo", row)}
          onViewInvoices={() => console.log("Ver facturas", row)}
          onDownloadInvoices={() => console.log("Descargar facturas", row)}
        />
      ),
    }


  ];


  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
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


      {/* TABLA */
      }
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          highlightOnHover
          striped
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
  );


}
