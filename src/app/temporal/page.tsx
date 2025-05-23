"use client";

import { useEffect, useState } from 'react';
import { fetchApiData } from '../../lib/api';
import TrafficEvolutionChart from '../components/charts/TrafficEvolutionChart';
import SpeedEvolutionChart from '../components/charts/SpeedEvolutionChart';
import TimePatternChart from '../components/charts/TimePatternChart';

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

interface HourlyPatternsData {
  [hour: string]: number;
}

export default function TemporalPage() {
  const [trafficEvolution, setTrafficEvolution] = useState<TrafficEvolutionData | null>(null);
  const [speedEvolution, setSpeedEvolution] = useState<SpeedEvolutionData | null>(null);
  const [hourlyPatterns, setHourlyPatterns] = useState<HourlyPatternsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [traffic, speed, patterns] = await Promise.all([
          fetchApiData<TrafficEvolutionData>('/detections/temporal/evolution'),
          fetchApiData<SpeedEvolutionData>('/detections/temporal/speed'),
          fetchApiData<HourlyPatternsData>('/detections/patterns/hourly')
        ]).catch(() => [null, null, null]);
        
        const hasTrafficData = traffic && traffic.timestamps && traffic.timestamps.length > 0;
        const hasSpeedData = speed && speed.timestamps && speed.timestamps.length > 0;
        const hasPatternsData = patterns && Object.keys(patterns).length > 0;
        
        if (hasTrafficData || hasSpeedData || hasPatternsData) {
          setTrafficEvolution(hasTrafficData ? traffic : null);
          setSpeedEvolution(hasSpeedData ? speed : null);
          setHourlyPatterns(hasPatternsData ? patterns : null);
        } else {
          setError('No hay datos temporales disponibles del backend');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos temporales');
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
          <div className="w-20 h-20 bg-gradient-to-br from-violet-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">📉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Cargando Tendencias Temporales</h2>
          <div className="w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
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

  if (!trafficEvolution && !speedEvolution && !hourlyPatterns) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">📉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Sin Datos Temporales</h2>
          <p className="text-gray-500">El backend no ha proporcionado datos de tendencias temporales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">📉</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Tendencias Temporales
          </h1>
          <p className="text-gray-600 text-lg">Análisis de la evolución del tráfico en el tiempo</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trafficEvolution && (
            <div className="professional-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Puntos de Datos</h3>
                  <p className="text-3xl font-bold text-violet-700">{trafficEvolution.timestamps.length}</p>
                  <p className="text-sm text-gray-500">mediciones temporales</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
          )}

          {speedEvolution && (
            <div className="professional-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Carriles Monitoreados</h3>
                  <p className="text-3xl font-bold text-blue-700">
                    {[speedEvolution.lane_1, speedEvolution.lane_2, speedEvolution.lane_3].filter(lane => lane.some(speed => speed > 0)).length}
                  </p>
                  <p className="text-sm text-gray-500">con datos de velocidad</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>
          )}

          {hourlyPatterns && (
            <div className="professional-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Horas Registradas</h3>
                  <p className="text-3xl font-bold text-emerald-700">{Object.keys(hourlyPatterns).length}</p>
                  <p className="text-sm text-gray-500">patrones horarios</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gráficas principales */}
        <div className="space-y-8">
          {/* Evolución del tráfico */}
          {trafficEvolution && (
            <div className="professional-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📈</span>
                Evolución del Tráfico por Tipo de Vehículo
              </h2>
              <TrafficEvolutionChart data={trafficEvolution} />
            </div>
          )}

          {/* Evolución de velocidad */}
          {speedEvolution && (
            <div className="professional-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">🏎️</span>
                Evolución de Velocidades por Carril
              </h2>
              <SpeedEvolutionChart data={speedEvolution} />
            </div>
          )}

          {/* Patrones horarios */}
          {hourlyPatterns && (
            <div className="professional-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">⏰</span>
                Patrones de Tráfico por Hora
              </h2>
              <TimePatternChart data={hourlyPatterns} />
            </div>
          )}
        </div>

        {/* Resumen de patrones horarios */}
        {hourlyPatterns && (
          <div className="mt-8 professional-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Resumen de Actividad por Horas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(hourlyPatterns)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([hour, count]) => (
                <div key={hour} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100 text-center">
                  <p className="font-semibold text-indigo-800 text-sm">{hour}</p>
                  <p className="text-lg font-bold text-indigo-900">{count}</p>
                  <div className="mt-1">
                    <div className="w-full bg-indigo-100 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-indigo-400 to-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min((count / Math.max(...Object.values(hourlyPatterns))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}