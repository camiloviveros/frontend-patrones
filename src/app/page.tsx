"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Dashboard from './components/Dashboard';
import { fetchData, DashboardData, cache } from '../lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  // Referencia para rastrear el tiempo de carga
  const loadingStartTime = useRef<number | null>(null);
  
  // Preparar la función fetchDashboardData con useCallback para evitar recreación
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Comenzar el cronómetro de carga
    loadingStartTime.current = performance.now();
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Obteniendo datos del dashboard... ${forceRefresh ? '(Actualización forzada)' : ''}`);
      const data = await fetchData(forceRefresh);
      
      if (!data) {
        throw new Error('No se recibieron datos del backend');
      }
      
      console.log("✅ Datos recibidos correctamente");
      setDashboardData(data);
      setLastUpdated(new Date());
      setConnectionAttempts(0);
      
      // Calcular tiempo de carga
      if (loadingStartTime.current) {
        const endTime = performance.now();
        const timeMs = Math.round(endTime - loadingStartTime.current);
        setLoadTime(timeMs);
        console.log(`⏱️ Tiempo de carga: ${timeMs}ms`);
      }
    } catch (err) {
      console.error('❌ Error al obtener datos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos');
      setConnectionAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
      loadingStartTime.current = null;
    }
  }, []);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Efecto para actualización automática
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // No mostrar el estado de carga para actualizaciones automáticas en segundo plano
      // para evitar parpadeo en la interfaz
      console.log("🔄 Actualizando datos automáticamente en segundo plano...");
      fetchDashboardData(true);
    }, 60000); // Actualizar cada 60 segundos
    
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  // Función para manejar reintentos
  const handleRetry = useCallback(() => {
    setConnectionAttempts(0);
    // Forzar actualización ignorando la caché
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Función para alternar la actualización automática
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);
  
  // Función para limpiar la caché
  const handleClearCache = useCallback(() => {
    cache.clear();
    console.log("🗑️ Caché eliminada completamente");
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-800">
        Sistema de Análisis de Tráfico
      </h1>
      <p className="text-center text-gray-600 mb-4">Monitoreo en tiempo real de patrones de tráfico vehicular</p>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button 
          onClick={() => fetchDashboardData(true)}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Ahora'}
        </button>
        
        <button 
          onClick={toggleAutoRefresh}
          className={`font-bold py-2 px-4 rounded ${
            autoRefresh 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {autoRefresh ? 'Detener Actualización Auto' : 'Activar Actualización Auto'}
        </button>
        
        <button 
          onClick={handleClearCache}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Limpiar Caché
        </button>
      </div>
      
      {lastUpdated && loadTime !== null && (
        <div className="text-center text-sm text-gray-600 mb-3">
          <p>Última actualización: {lastUpdated.toLocaleTimeString()}</p>
          <p>Tiempo de carga: {loadTime} ms</p>
        </div>
      )}
      
      {initialLoading && !dashboardData && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-xl text-blue-700 font-semibold">Cargando datos iniciales...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p className="font-bold">Error al cargar los datos</p>
          <p>{error}</p>
          
          <div className="mt-4">
            <button 
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Reintentar conexión
            </button>
          </div>
          
          {connectionAttempts >= 3 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-bold">Recomendaciones para resolver el problema:</p>
              <ol className="list-decimal pl-5 mt-2">
                <li>Verifique que el servidor Spring Boot esté ejecutándose en <code className="bg-gray-100 px-1">http://localhost:8080</code></li>
                <li>Ejecute <code className="bg-gray-100 px-1">mvn spring-boot:run</code> en la carpeta del proyecto backend</li>
                <li>Revise la consola del navegador (F12) para ver errores específicos</li>
                <li>Visite <code className="bg-gray-100 px-1 text-blue-600"><a href="/api-test" target="_blank">/api-test</a></code> para diagnóstico detallado</li>
                <li>Si persiste el problema, pruebe limpiando la caché del navegador o reiniciando tanto el frontend como el backend</li>
              </ol>
            </div>
          )}
        </div>
      )}
      
      {dashboardData && (
        <>
          {isLoading ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-8">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-700 mr-2"></div>
                <p>Actualizando datos...</p>
              </div>
            </div>
          ) : !error ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
              <p className="font-bold">Conexión establecida</p>
              <p>Datos cargados correctamente. {autoRefresh ? 'Actualización automática cada 60 segundos.' : 'Actualización automática desactivada.'}</p>
            </div>
          ) : null}
          
          <Dashboard data={dashboardData} isLoading={isLoading} />
        </>
      )}
      
      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>Sistema de Análisis de Tráfico Vehicular © {new Date().getFullYear()}</p>
        <p className="mt-1">Versión 1.1 - Rendimiento Optimizado</p>
      </div>
    </div>
  );
}