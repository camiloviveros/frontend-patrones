"use client";

import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { fetchData, DashboardData } from '../lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalVolume: {
      hourly: {},
      daily: {},
      total: {}
    },
    volumeByLane: {},
    hourlyPatterns: {},
    avgSpeedByLane: {},
    bottlenecks: [],
    trafficEvolution: {
      timestamps: [],
      car: [],
      bus: [],
      truck: []
    },
    speedEvolution: {
      timestamps: [],
      lane_1: [],
      lane_2: [],
      lane_3: []
    },
    vehicleTypeDominance: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching dashboard data...");
        const data = await fetchData();
        
        if (!data || typeof data !== 'object') {
          throw new Error('Los datos recibidos no son válidos');
        }
        
        console.log("Data received:", data);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Configurar un intervalo para actualizar los datos cada 30 segundos
    const intervalId = setInterval(fetchDashboardData, 30000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-800">
        Sistema de Análisis de Tráfico
      </h1>
      <p className="text-center text-gray-600 mb-8">Monitoreo en tiempo real de patrones de tráfico vehicular</p>
      
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-xl text-blue-700 font-semibold">Cargando datos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p className="font-bold">Error al cargar los datos</p>
          <p>{error}</p>
          <p className="mt-2">Intente recargar la página o verifique la conexión al servidor.</p>
        </div>
      ) : (
        <>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
            <p className="font-bold">Conexión establecida</p>
            <p>Datos cargados correctamente. Actualización automática cada 30 segundos.</p>
          </div>
          <Dashboard data={dashboardData} />
        </>
      )}
      
      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>Sistema de Análisis de Tráfico Vehicular © {new Date().getFullYear()}</p>
        <p className="mt-1">Versión 1.0</p>
      </div>
    </div>
  );
}