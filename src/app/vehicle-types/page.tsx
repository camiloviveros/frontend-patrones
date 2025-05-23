"use client";

import { useEffect, useState } from 'react';
import { fetchApiData } from '../../lib/api';
import VehicleTypeChart from '../components/charts/VehicleTypeChart';

interface VehicleTypeDominanceData {
  [vehicleType: string]: number;
}

interface TotalVolumeData {
  total: Record<string, number>;
}

export default function VehicleTypesPage() {
  const [dominanceData, setDominanceData] = useState<VehicleTypeDominanceData | null>(null);
  const [totalData, setTotalData] = useState<TotalVolumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [dominance, total] = await Promise.all([
          fetchApiData<VehicleTypeDominanceData>('/detections/vehicle-types/dominance'),
          fetchApiData<TotalVolumeData>('/detections/volume/total')
        ]).catch(() => [null, null]);
        
        const hasDominanceData = dominance && Object.keys(dominance).length > 0;
        const hasTotalData = total && total.total && Object.keys(total.total).length > 0;
        
        if (hasDominanceData || hasTotalData) {
          setDominanceData(hasDominanceData ? dominance : null);
          setTotalData(hasTotalData ? total : null);
        } else {
          setError('No hay datos de tipos de vehículos disponibles del backend');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos de tipos de vehículos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🚗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Cargando Tipos de Vehículos</h2>
          <div className="w-8 h-8 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error de Conexión</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dominanceData && !totalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">🚗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Sin Datos de Vehículos</h2>
          <p className="text-gray-500">El backend no ha proporcionado datos de tipos de vehículos</p>
        </div>
      </div>
    );
  }

  const vehicleIcons = {
    car: '🚗',
    bus: '🚌',
    truck: '🚛',
    motorcycle: '🏍️',
    bicycle: '🚲'
  };

  const vehicleNames = {
    car: 'Automóviles',
    bus: 'Autobuses',
    truck: 'Camiones',
    motorcycle: 'Motocicletas',
    bicycle: 'Bicicletas'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">🚗</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Análisis de Tipos de Vehículos
          </h1>
          <p className="text-gray-600 text-lg">Distribución y comportamiento por categoría vehicular</p>
        </div>

        {/* Estadísticas por tipo */}
        {totalData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(totalData.total).map(([type, count], index) => {
              const percentage = dominanceData ? dominanceData[type] || 0 : 0;
              
              return (
                <div 
                  key={type}
                  className="professional-card p-6 rounded-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {vehicleNames[type as keyof typeof vehicleNames] || type}
                      </h3>
                      <p className="text-3xl font-bold text-orange-700">{count}</p>
                      <p className="text-sm text-gray-500">vehículos detectados</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">
                        {vehicleIcons[type as keyof typeof vehicleIcons] || '🚗'}
                      </span>
                    </div>
                  </div>
                  
                  {percentage > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Porcentaje del total</span>
                        <span className="text-sm font-semibold text-orange-700">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-orange-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Gráfica de distribución */}
        {dominanceData && (
          <div className="professional-card p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Distribución Porcentual de Tipos de Vehículos
            </h2>
            <VehicleTypeChart data={dominanceData} />
          </div>
        )}

        {/* Análisis detallado */}
        {totalData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ranking de vehículos */}
            <div className="professional-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Ranking por Cantidad
              </h3>
              <div className="space-y-3">
                {Object.entries(totalData.total)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count], index) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center font-bold text-orange-800">
                        {index + 1}
                      </div>
                      <span className="text-2xl">
                        {vehicleIcons[type as keyof typeof vehicleIcons] || '🚗'}
                      </span>
                      <span className="font-medium text-gray-800">
                        {vehicleNames[type as keyof typeof vehicleNames] || type}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Características por tipo */}
            <div className="professional-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Características por Tipo
              </h3>
              <div className="space-y-4">
                {Object.entries(totalData.total).map(([type, count]) => {
                  const percentage = dominanceData ? dominanceData[type] || 0 : 0;
                  
                  return (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">
                            {vehicleIcons[type as keyof typeof vehicleIcons] || '🚗'}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {vehicleNames[type as keyof typeof vehicleNames] || type}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{count} unidades</span>
                      </div>
                      
                      {percentage > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-orange-50 p-2 rounded">
                            <span className="text-orange-700 font-medium">Participación</span>
                            <p className="font-bold text-orange-800">{percentage.toFixed(1)}%</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-blue-700 font-medium">Categoría</span>
                            <p className="font-bold text-blue-800">
                              {percentage > 50 ? 'Dominante' : percentage > 25 ? 'Significativo' : 'Minoritario'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}