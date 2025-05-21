"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
        
        // Usar fetch con un timeout corto pero sin signal para evitar errores de abort
        const fetchPromise = fetch('http://localhost:8080/api/detections/volume/total', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors' // Asegurarnos de que es una petición CORS
        });
        
        // Crear un timeout manual
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 3000);
        });
        
        // Usar Promise.race para implementar un timeout sin usar AbortController
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (response.ok) {
          setApiStatus('online');
          setStatusDetails('API conectada correctamente');
        } else {
          setApiStatus('offline');
          setStatusDetails(`API responde con error: ${response.status}`);
        }
      } catch (error) {
        setApiStatus('offline');
        setStatusDetails('Error de conexión con la API');
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
            <Link href="/api-test" className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-md transition-colors">
              Test API
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
            <Link href="/api-test" className="block py-2 px-3 bg-yellow-600 rounded-md text-white transition-colors">
              Test API
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}