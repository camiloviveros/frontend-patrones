// src/lib/api.ts
// Versión modificada para conectarse directamente al backend en lugar de usar el proxy de Next.js

// Configuración base para fetch - usamos conexión directa
const API_BASE_URL = 'http://localhost:8080/api'; // Conexión directa al backend

/**
 * Configuración de fetch para todas las peticiones
 */
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  // Modo CORS para peticiones cross-origin
  mode: 'cors' as RequestMode,
};

/**
 * Maneja errores de fetch de forma centralizada
 */
const handleFetchError = (error: unknown, endpoint: string) => {
  console.error(`Error fetching from ${endpoint}:`, error);
  return null; // Devolvemos null para manejar de forma segura en los componentes
};

/**
 * Prueba la conexión con el backend
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log(`Probando conexión directa a ${API_BASE_URL}/detections/volume/total`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/detections/volume/total`, {
      ...fetchConfig,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('Conexión directa exitosa:', await response.json());
      return true;
    } else {
      console.error(`Conexión directa fallida: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('Error en conexión directa:', error);
    return false;
  }
};

/**
 * Función genérica para fetching con timeout y reintentos
 */
const fetchWithRetry = async (endpoint: string, retries = 2, timeout = 10000) => {
  let attempts = 0;
  
  const executeFetch = async (): Promise<any> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      console.log(`Fetching data from: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchConfig,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Data received from ${endpoint}:`, data);
      return data;
    } catch (error) {
      attempts++;
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn(`Request to ${endpoint} timed out after ${timeout}ms`);
      }
      
      if (attempts <= retries) {
        console.log(`Retry attempt ${attempts} for ${endpoint}`);
        return executeFetch();
      }
      
      return handleFetchError(error, endpoint);
    }
  };
  
  return executeFetch();
};

// Interfaces para los diferentes tipos de datos
export interface TotalVolumeData {
  hourly: Record<string, number>;
  daily: Record<string, number>;
  total: Record<string, number>;
}

export interface VehicleCounts {
  [vehicleType: string]: number;
}

export interface LaneVehicleData {
  [lane: string]: VehicleCounts;
}

export interface HourlyPatternsData {
  [hour: string]: number;
}

export interface SpeedByLaneData {
  [lane: string]: number;
}

export interface BottleneckItem {
  lane: string;
  avgSpeed: number;
  totalVehicles: number;
  heavyVehicles: number;
}

export interface TrafficEvolutionData {
  timestamps: string[];
  car: number[];
  bus: number[];
  truck: number[];
}

export interface SpeedEvolutionData {
  timestamps: string[];
  lane_1: number[];
  lane_2: number[];
  lane_3: number[];
}

export interface VehicleTypeDominanceData {
  [vehicleType: string]: number;
}

// Interfaz para el objeto data completo
export interface DashboardData {
  totalVolume: TotalVolumeData;
  volumeByLane: LaneVehicleData;
  hourlyPatterns: HourlyPatternsData;
  avgSpeedByLane: SpeedByLaneData;
  bottlenecks: BottleneckItem[];
  trafficEvolution: TrafficEvolutionData;
  speedEvolution: SpeedEvolutionData;
  vehicleTypeDominance: VehicleTypeDominanceData;
}

// Función para verificar si un objeto es válido y tiene propiedades
function isValidData(data: any): boolean {
  return data && typeof data === 'object' && Object.keys(data).length > 0;
}

/**
 * Función para obtener todos los datos del dashboard de forma paralela
 */
export const fetchData = async (): Promise<DashboardData> => {
  try {
    console.log('Fetching all dashboard data...');
    
    // Intentamos primero una conexión directa para diagnóstico
    const directConnectionOk = await testBackendConnection();
    console.log(`Conexión directa al backend: ${directConnectionOk ? 'OK' : 'Fallida'}`);
    
    if (!directConnectionOk) {
      console.error('No se pudo conectar directamente al backend. Usando datos de respaldo.');
      return getBackupData();
    }
    
    const [
      totalVolume,
      volumeByLane,
      hourlyPatterns,
      avgSpeedByLane,
      bottlenecks,
      trafficEvolution,
      speedEvolution,
      vehicleTypeDominance
    ] = await Promise.allSettled([
      fetchWithRetry('/detections/volume/total'),
      fetchWithRetry('/detections/volume/by-lane'),
      fetchWithRetry('/detections/patterns/hourly'),
      fetchWithRetry('/detections/lanes/speed'),
      fetchWithRetry('/detections/lanes/bottlenecks'),
      fetchWithRetry('/detections/temporal/evolution'),
      fetchWithRetry('/detections/temporal/speed'),
      fetchWithRetry('/detections/vehicle-types/dominance')
    ]);
    
    // Procesa los resultados y proporciona valores predeterminados para casos fallidos
    const processedData: DashboardData = {
      totalVolume: totalVolume.status === 'fulfilled' && isValidData(totalVolume.value) ? 
        totalVolume.value : { hourly: {}, daily: {}, total: { "car": 25, "bus": 5, "truck": 10 } },
      
      volumeByLane: volumeByLane.status === 'fulfilled' && isValidData(volumeByLane.value) ? 
        volumeByLane.value : getBackupData().volumeByLane,
      
      hourlyPatterns: hourlyPatterns.status === 'fulfilled' && isValidData(hourlyPatterns.value) ? 
        hourlyPatterns.value : getBackupData().hourlyPatterns,
      
      avgSpeedByLane: avgSpeedByLane.status === 'fulfilled' && isValidData(avgSpeedByLane.value) ? 
        avgSpeedByLane.value : getBackupData().avgSpeedByLane,
      
      bottlenecks: bottlenecks.status === 'fulfilled' && Array.isArray(bottlenecks.value) ? 
        bottlenecks.value : getBackupData().bottlenecks,
      
      trafficEvolution: trafficEvolution.status === 'fulfilled' && isValidData(trafficEvolution.value) ? 
        trafficEvolution.value : getBackupData().trafficEvolution,
      
      speedEvolution: speedEvolution.status === 'fulfilled' && isValidData(speedEvolution.value) ? 
        speedEvolution.value : getBackupData().speedEvolution,
      
      vehicleTypeDominance: vehicleTypeDominance.status === 'fulfilled' && isValidData(vehicleTypeDominance.value) ? 
        vehicleTypeDominance.value : getBackupData().vehicleTypeDominance
    };
    
    console.log('Processed dashboard data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Devuelve datos de respaldo en caso de error
    return getBackupData();
  }
};

// Datos de respaldo para cuando la API no está disponible
function getBackupData(): DashboardData {
  return {
    totalVolume: { 
      hourly: { "morning": 150, "afternoon": 200, "evening": 120 },
      daily: { "weekday": 1800, "weekend": 950 },
      total: { "car": 25, "bus": 5, "truck": 10 }
    },
    volumeByLane: {
      "lane_1": { "car": 12, "truck": 3, "bus": 1 },
      "lane_2": { "car": 8, "bus": 2 },
      "lane_3": { "car": 5, "truck": 2 }
    },
    hourlyPatterns: {
      "08:00": 120, "09:00": 180, "10:00": 150, "11:00": 130, 
      "12:00": 160, "13:00": 170, "14:00": 150, "15:00": 145, 
      "16:00": 160, "17:00": 190, "18:00": 210, "19:00": 180
    },
    avgSpeedByLane: {
      "lane_1": 85.2,
      "lane_2": 62.8,
      "lane_3": 78.5
    },
    bottlenecks: [
      {
        lane: "lane_2",
        avgSpeed: 12.5,
        totalVehicles: 45,
        heavyVehicles: 8
      }
    ],
    trafficEvolution: {
      timestamps: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
      car: [12, 18, 25, 20, 22, 30],
      bus: [2, 3, 5, 4, 6, 7],
      truck: [3, 5, 7, 6, 8, 10]
    },
    speedEvolution: {
      timestamps: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
      lane_1: [60, 65, 70, 68, 72, 75],
      lane_2: [50, 55, 58, 57, 60, 62],
      lane_3: [65, 70, 72, 73, 75, 78]
    },
    vehicleTypeDominance: {
      "car": 65.8,
      "bus": 12.5,
      "truck": 21.7
    }
  };
}

// Funciones individuales para endpoints específicos
export const fetchTotalVehicleVolume = async (): Promise<TotalVolumeData> => {
  const result = await fetchWithRetry('/detections/volume/total');
  return result || { hourly: {}, daily: {}, total: { "car": 25, "bus": 5, "truck": 10 } };
};

export const fetchVehicleVolumeByLane = async (): Promise<LaneVehicleData> => {
  const result = await fetchWithRetry('/detections/volume/by-lane');
  return result || getBackupData().volumeByLane;
};

export const fetchHourlyPatterns = async (): Promise<HourlyPatternsData> => {
  const result = await fetchWithRetry('/detections/patterns/hourly');
  return result || getBackupData().hourlyPatterns;
};

export const fetchAvgSpeedByLane = async (): Promise<SpeedByLaneData> => {
  const result = await fetchWithRetry('/detections/lanes/speed');
  return result || getBackupData().avgSpeedByLane;
};

export const fetchBottlenecks = async (): Promise<BottleneckItem[]> => {
  const result = await fetchWithRetry('/detections/lanes/bottlenecks');
  return result || getBackupData().bottlenecks;
};

export const fetchTrafficEvolution = async (): Promise<TrafficEvolutionData> => {
  const result = await fetchWithRetry('/detections/temporal/evolution');
  return result || getBackupData().trafficEvolution;
};

export const fetchSpeedEvolution = async (): Promise<SpeedEvolutionData> => {
  const result = await fetchWithRetry('/detections/temporal/speed');
  return result || getBackupData().speedEvolution;
};

export const fetchVehicleTypeDominance = async (): Promise<VehicleTypeDominanceData> => {
  const result = await fetchWithRetry('/detections/vehicle-types/dominance');
  return result || getBackupData().vehicleTypeDominance;
};

// 5. Estructuras de datos
export const fetchArrayData = async (): Promise<number[]> => {
  const result = await fetchWithRetry('/detections/structures/array');
  return result || [45, 23, 78, 12, 90, 32, 56, 67];
};

export const fetchLinkedListData = async () => {
  const result = await fetchWithRetry('/detections/structures/linked-list');
  return result || generateMockListData(8);
};

export const fetchDoubleLinkedListData = async () => {
  const result = await fetchWithRetry('/detections/structures/double-linked-list');
  return result || generateMockListData(8);
};

export const fetchCircularDoubleLinkedListData = async () => {
  const result = await fetchWithRetry('/detections/structures/circular-double-linked-list');
  return result || generateMockListData(8);
};

export const fetchStackData = async () => {
  const result = await fetchWithRetry('/detections/structures/stack');
  return result || generateMockListData(8);
};

export const fetchQueueData = async () => {
  const result = await fetchWithRetry('/detections/structures/queue');
  return result || generateMockListData(8);
};

export const fetchTreeData = async () => {
  const result = await fetchWithRetry('/detections/structures/tree');
  return result || {
    value: "Root",
    children: [
      {
        value: "A",
        children: [
          { value: "A1", children: null },
          { value: "A2", children: null }
        ]
      },
      {
        value: "B",
        children: [
          { value: "B1", children: null },
          { value: "B2", children: null }
        ]
      }
    ]
  };
};

// Función auxiliar para generar datos de ejemplo para estructuras de lista
function generateMockListData(count: number) {
  const result = [];
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    
    result.push({
      id: i,
      date: date.toISOString().replace('T', ' ').substring(0, 16)
    });
  }
  
  return result;
}