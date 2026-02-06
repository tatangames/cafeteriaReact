import {Modal} from "../ui/modal";

interface DeleteRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    roleName: string;
    isDeleting?: boolean;
}

export default function DeleteRoleModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            roleName,
                                            isDeleting = false,
                                        }: DeleteRoleModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-white">
                    Borrar Rol Global
                </h2>

                {/* Description */}
                <p className="mb-8 max-w-md text-sm text-gray-600 dark:text-gray-400">
                    Esta acción eliminara el Rol{" "}
                    <span className="font-semibold text-gray-800 dark:text-white">
            {roleName}
          </span>{" "}
                    con todos sus Permisos.
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="min-w-[140px] rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="min-w-[140px] rounded-lg bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <span className="flex items-center justify-center gap-2">
                <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  />
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Borrando...
              </span>
                        ) : (
                            "Borrar"
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}