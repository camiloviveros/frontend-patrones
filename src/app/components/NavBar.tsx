"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { testBackendConnection } from '@/lib/api';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [statusDetails, setStatusDetails] = useState<string>('Verificando conexión...');

  // Verificar estado de la API
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus('loading');
        setStatusDetails('Verificando conexión API...');

        // Usamos la conexión directa para verificar
        const connectionOk = await testBackendConnection();
        
        if (connectionOk) {
          setApiStatus('online');
          setStatusDetails('API conectada correctamente');
          console.log('Conexión directa exitosa al backend');
        } else {
          setApiStatus('offline');
          setStatusDetails('API no disponible');
          console.error('No se pudo conectar al backend');
        }
      } catch (error) {
        console.error('Error al verificar estado de la API:', error);
        setApiStatus('offline');
        setStatusDetails('Error al conectar con la API');
      }
    };

    checkApiStatus();
    // Verificar cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <div className="text-xl font-bold mr-4">
              Sistema de Análisis de Tráfico
            </div>
            <div className="hidden sm:flex items-center">
              {apiStatus === 'loading' && (
                <span className="flex items-center">
                  <span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                  <span className="text-xs text-yellow-300" title={statusDetails}>Verificando...</span>
                </span>
              )}
              {apiStatus === 'online' && (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                  <span className="text-xs text-green-300" title={statusDetails}>API Conectada</span>
                </span>
              )}
              {apiStatus === 'offline' && (
                <span className="flex items-center cursor-help" title={statusDetails}>
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  <span className="text-xs text-red-300">API Desconectada</span>
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Dashboard
            </Link>
            <Link href="/volume" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Volumen de Tráfico
            </Link>
            <Link href="/lanes" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Análisis de Carriles
            </Link>
            <Link href="/temporal" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Tendencias Temporales
            </Link>
            <Link href="/vehicle-types" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Tipos de Vehículos
            </Link>
            <Link href="/structures" className="hover:text-blue-200 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Estructuras de Datos
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
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
          <div className="md:hidden pb-3 border-t border-blue-700 pt-2">
            <div className="flex items-center py-2 mb-2">
              {apiStatus === 'loading' && (
                <span className="flex items-center">
                  <span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                  <span className="text-xs text-yellow-300" title={statusDetails}>Verificando conexión...</span>
                </span>
              )}
              {apiStatus === 'online' && (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                  <span className="text-xs text-green-300" title={statusDetails}>API Conectada</span>
                </span>
              )}
              {apiStatus === 'offline' && (
                <span className="flex items-center cursor-help" title={statusDetails}>
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  <span className="text-xs text-red-300">API Desconectada</span>
                </span>
              )}
            </div>
            <Link href="/" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Dashboard
            </Link>
            <Link href="/volume" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Volumen de Tráfico
            </Link>
            <Link href="/lanes" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Análisis de Carriles
            </Link>
            <Link href="/temporal" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Tendencias Temporales
            </Link>
            <Link href="/vehicle-types" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Tipos de Vehículos
            </Link>
            <Link href="/structures" className="block py-2 px-3 hover:bg-blue-700 rounded-md hover:text-blue-200 transition-colors">
              Estructuras de Datos
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}