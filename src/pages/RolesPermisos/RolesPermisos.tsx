import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";

import { getRolePermissionsTable } from "../../services/api";
import { getToken } from "../../utils/auth";

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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (permiso: Permiso) => {
        console.log("Eliminar permiso", permiso);
        // aquí luego conectamos la API para detach
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

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Permisos del Rol
                </h1>
                <p className="text-sm text-gray-500">
                    Rol: <strong>{roleName}</strong>
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <DataTable
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                    noDataComponent={
                        <div className="py-6 text-sm text-gray-500">
                            No hay permisos asignados
                        </div>
                    }
                />
            </div>
        </div>
    );
}
