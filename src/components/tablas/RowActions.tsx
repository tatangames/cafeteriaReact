import { useEffect, useRef, useState } from "react";

export default function RowActions({
                                     onViewDetail,
                                     onViewInvoices,
                                     onDownloadInvoices,
                                   }: any) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.right - 208,
      });
    }

    setOpen((prev) => !prev);
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* BOTÓN */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="
          w-8 h-8 flex items-center justify-center
          rounded-full bg-blue-600 hover:bg-blue-700
          text-white transition
        "
      >
        ▾
      </button>

      {/* MENÚ */}
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
          }}
          className="
            w-52 rounded-xl
            border border-gray-200
            bg-white shadow-xl
            text-gray-700
          "
        >
          <button
            className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-t-xl"
            onClick={() => {
              setOpen(false);
              onViewDetail?.();
            }}
          >
            Detalle completo
          </button>

          <button
            className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              onViewInvoices?.();
            }}
          >
            Ver facturas
          </button>

          <button
            className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-b-xl"
            onClick={() => {
              setOpen(false);
              onDownloadInvoices?.();
            }}
          >
            Descargar facturas
          </button>
        </div>
      )}
    </>
  );
}
