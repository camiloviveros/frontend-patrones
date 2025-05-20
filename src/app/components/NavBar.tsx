"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="text-xl font-bold">
            Sistema de Análisis de Tráfico
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-blue-200 py-2">
              Dashboard
            </Link>
            <Link href="/volume" className="hover:text-blue-200 py-2">
              Volumen de Tráfico
            </Link>
            <Link href="/lanes" className="hover:text-blue-200 py-2">
              Análisis de Carriles
            </Link>
            <Link href="/temporal" className="hover:text-blue-200 py-2">
              Tendencias Temporales
            </Link>
            <Link href="/vehicle-types" className="hover:text-blue-200 py-2">
              Tipos de Vehículos
            </Link>
            <Link href="/structures" className="hover:text-blue-200 py-2">
              Estructuras de Datos
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden pb-3">
            <Link href="/" className="block py-2 hover:text-blue-200">
              Dashboard
            </Link>
            <Link href="/volume" className="block py-2 hover:text-blue-200">
              Volumen de Tráfico
            </Link>
            <Link href="/lanes" className="block py-2 hover:text-blue-200">
              Análisis de Carriles
            </Link>
            <Link href="/temporal" className="block py-2 hover:text-blue-200">
              Tendencias Temporales
            </Link>
            <Link href="/vehicle-types" className="block py-2 hover:text-blue-200">
              Tipos de Vehículos
            </Link>
            <Link href="/structures" className="block py-2 hover:text-blue-200">
              Estructuras de Datos
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}