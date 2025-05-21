import React, { memo } from 'react';
import TrafficVolumeChart from './charts/TrafficVolumeChart';
import LaneDistributionChart from './charts/LaneDistributionChart';
import TimePatternChart from './charts/TimePatternChart';
import SpeedComparisonChart from './charts/SpeedComparisonChart';
import BottleneckChart from './charts/BottleneckChart';
import TrafficEvolutionChart from './charts/TrafficEvolutionChart';
import SpeedEvolutionChart from './charts/SpeedEvolutionChart';
import VehicleTypeChart from './charts/VehicleTypeChart';
import { DashboardData } from '@/lib/api';

// Interfaz para las props del componente
interface DashboardProps {
  data: DashboardData;
  isLoading?: boolean;
}

// Usar React.memo para reducir renderizados innecesarios
const Dashboard = memo(({ data, isLoading = false }: DashboardProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  // Verificar que todos los datos necesarios estén presentes
  const { 
    totalVolume, 
    volumeByLane, 
    hourlyPatterns, 
    avgSpeedByLane, 
    bottlenecks,
    trafficEvolution, 
    speedEvolution, 
    vehicleTypeDominance 
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8 6a6 6 0 100-12 6 6 0 000 12zm1-6a1 1 0 10-2 0v2a1 1 0 102 0v-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Volumen Total de Vehículos</h2>
        </div>
        <TrafficVolumeChart data={totalVolume || { total: {} }} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Distribución por Carril</h2>
        </div>
        <LaneDistributionChart data={volumeByLane || {}} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Patrones Horarios de Tráfico</h2>
        </div>
        <TimePatternChart data={hourlyPatterns || {}} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Comparación de Velocidad por Carril</h2>
        </div>
        <SpeedComparisonChart data={avgSpeedByLane || {}} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Cuellos de Botella Identificados</h2>
        </div>
        <BottleneckChart data={bottlenecks || []} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Evolución del Tráfico</h2>
        </div>
        <TrafficEvolutionChart data={trafficEvolution || { timestamps: [], car: [], bus: [], truck: [] }} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-cyan-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Evolución de la Velocidad</h2>
        </div>
        <SpeedEvolutionChart data={speedEvolution || { timestamps: [], lane_1: [], lane_2: [], lane_3: [] }} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Dominancia por Tipo de Vehículo</h2>
        </div>
        <VehicleTypeChart data={vehicleTypeDominance || {}} />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimización: solo renderizar si el estado de carga cambia o si los datos son realmente diferentes
  if (prevProps.isLoading !== nextProps.isLoading) {
    return false; // renderizar nuevamente
  }
  
  // Verificación profunda de igualdad para evitar renderizados innecesarios
  // Solo comparamos algunos campos clave para evitar una comparación costosa completa
  const prevData = prevProps.data;
  const nextData = nextProps.data;
  
  if (!prevData || !nextData) {
    return prevData === nextData;
  }
  
  // Comprobar si alguna de las métricas principales ha cambiado
  if (JSON.stringify(prevData.totalVolume?.total) !== JSON.stringify(nextData.totalVolume?.total)) {
    return false;
  }
  
  if (Object.keys(prevData.volumeByLane || {}).length !== Object.keys(nextData.volumeByLane || {}).length) {
    return false;
  }
  
  // Si llegamos aquí, consideramos que los datos son iguales
  return true;
});

export default Dashboard;