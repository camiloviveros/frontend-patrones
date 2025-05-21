"use client";

import { useState, useEffect } from 'react';
import {
  fetchTotalVehicleVolume,
  fetchVehicleVolumeByLane,
  fetchHourlyPatterns,
  fetchAvgSpeedByLane,
  fetchBottlenecks,
  fetchTrafficEvolution,
  fetchSpeedEvolution,
  fetchVehicleTypeDominance,
  fetchArrayData,
  fetchLinkedListData,
  fetchDoubleLinkedListData,
  fetchCircularDoubleLinkedListData,
  fetchStackData,
  fetchQueueData,
  fetchTreeData
} from '@/lib/api';

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const testEndpoint = async (name: string, fetchFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    try {
      const data = await fetchFunction();
      setResults(prev => ({ ...prev, [name]: data }));
      console.log(`[${name}] Data:`, data);
    } catch (error) {
      console.error(`[${name}] Error:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [name]: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };
  
  const testAll = async () => {
    // Dashboard Data
    testEndpoint('totalVolume', fetchTotalVehicleVolume);
    testEndpoint('volumeByLane', fetchVehicleVolumeByLane);
    testEndpoint('hourlyPatterns', fetchHourlyPatterns);
    testEndpoint('avgSpeedByLane', fetchAvgSpeedByLane);
    testEndpoint('bottlenecks', fetchBottlenecks);
    testEndpoint('trafficEvolution', fetchTrafficEvolution);
    testEndpoint('speedEvolution', fetchSpeedEvolution);
    testEndpoint('vehicleTypeDominance', fetchVehicleTypeDominance);
    
    // Estructura de datos
    testEndpoint('arrayData', fetchArrayData);
    testEndpoint('linkedList', fetchLinkedListData);
    testEndpoint('doubleLinkedList', fetchDoubleLinkedListData);
    testEndpoint('circularDoubleLinkedList', fetchCircularDoubleLinkedListData);
    testEndpoint('stack', fetchStackData);
    testEndpoint('queue', fetchQueueData);
    testEndpoint('tree', fetchTreeData);
  };
  
  useEffect(() => {
    // Auto-test on load
    testAll();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Test de APIs</h1>
      
      <div className="mb-6">
        <button 
          onClick={testAll}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Probar Todos los Endpoints
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(loading).map(endpoint => (
          <div key={endpoint} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold">{endpoint}</h2>
            
            {loading[endpoint] ? (
              <div className="mt-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span>Cargando...</span>
              </div>
            ) : errors[endpoint] ? (
              <div className="mt-2 text-red-500">
                <p className="font-semibold">Error:</p>
                <p>{errors[endpoint]}</p>
              </div>
            ) : results[endpoint] ? (
              <div className="mt-2">
                <p className="font-semibold text-green-600">Datos recibidos correctamente ✓</p>
                <div className="mt-2 max-h-40 overflow-auto bg-gray-50 p-2 rounded text-xs">
                  <pre>{JSON.stringify(results[endpoint], null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-gray-500">Sin datos</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}