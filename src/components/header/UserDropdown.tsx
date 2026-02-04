import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { logout } from "../../services/api";
import { clearAuth, getAuth } from "../../utils/auth.ts";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const auth = getAuth();

      if (auth?.token) {
        await logout(auth.token);
      }
    } catch (error) {
      console.error("Error logout:", error);
    } finally {
      clearAuth();
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/", { replace: true });
      }, 300);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400"
        >
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
            <img src="/images/user/owner.jpg" alt="User" />
          </span>

          <span className="block mr-1 font-medium text-theme-sm">
            Musharof
          </span>

          <svg
            className={`transition-transform duration-200 stroke-gray-500 dark:stroke-gray-400 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-4 w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        >
          <div>
            <span className="block font-medium text-gray-700 dark:text-gray-400">
              Musharof Chowdhury
            </span>
            <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
              randomuser@pimjo.com
            </span>
          </div>

          <ul className="pt-4 pb-3 mt-3 border-b border-gray-200 dark:border-gray-800 space-y-1">
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                to="/profile"
                className="dropdown-item"
              >
                Edit profile
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                to="/profile"
                className="dropdown-item"
              >
                Account settings
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                to="/support"
                className="dropdown-item"
              >
                Support
              </DropdownItem>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 disabled:opacity-50"
          >
            {isLoggingOut ? "Cerrando sesión..." : "Sign out"}
          </button>
        </Dropdown>
      </div>

      {/* MODAL DE CARGA */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-dark rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Cerrando sesión...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
