// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { fetchData } from '../lib/api';

// Definición de interfaces para tipos de datos
interface TotalVolumeData {
  hourly: Record<string, number>;
  daily: Record<string, number>;
  total: Record<string, number>;
}

interface VehicleCounts {
  [vehicleType: string]: number;
}

interface LaneVehicleData {
  [lane: string]: VehicleCounts;
}

interface HourlyPatternsData {
  [hour: string]: number;
}

interface SpeedByLaneData {
  [lane: string]: number;
}

interface BottleneckItem {
  lane: string;
  avgSpeed: number;
  totalVehicles: number;
  heavyVehicles: number;
}

interface TrafficEvolutionData {
  timestamps: string[];
  car: number[];
  bus: number[];
  truck: number[];
}

interface SpeedEvolutionData {
  timestamps: string[];
  lane_1: number[];
  lane_2: number[];
  lane_3: number[];
}

interface VehicleTypeDominanceData {
  [vehicleType: string]: number;
}

// Interfaz para el objeto data completo
interface DashboardData {
  totalVolume: TotalVolumeData;
  volumeByLane: LaneVehicleData;
  hourlyPatterns: HourlyPatternsData;
  avgSpeedByLane: SpeedByLaneData;
  bottlenecks: BottleneckItem[];
  trafficEvolution: TrafficEvolutionData;
  speedEvolution: SpeedEvolutionData;
  vehicleTypeDominance: VehicleTypeDominanceData;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
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
      try {
        // Usamos la nueva función unificada para obtener todos los datos
        const data = await fetchData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Configurar un intervalo para actualizar los datos cada 10 segundos
    const intervalId = setInterval(fetchDashboardData, 10000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-700"></div>
        <p className="ml-4 text-xl text-blue-700 font-semibold">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-800">
        Sistema de Análisis de Tráfico
      </h1>
      <p className="text-center text-gray-600 mb-8">Monitoreo en tiempo real de patrones de tráfico vehicular</p>
      <Dashboard data={dashboardData} />
    </div>
  );
}