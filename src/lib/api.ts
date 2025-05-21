// src/lib/api.ts
// Configuración base para fetch
const API_BASE_URL = '/api'; // Cambiado para usar el proxy de Next.js

/**
 * Configuración de fetch para todas las peticiones
 */
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Maneja errores de fetch de forma centralizada
 */
const handleFetchError = (error: unknown, endpoint: string) => {
  console.error(`Error fetching from ${endpoint}:`, error);
  // Si es necesario, aquí podrías integrar algún servicio de logging como Sentry
  return null; // Devolvemos null para manejar de forma segura en los componentes
};

/**
 * Función genérica para fetching con timeout y reintentos
 */
const fetchWithRetry = async (endpoint: string, retries = 2, timeout = 5000) => {
  let attempts = 0;
  
  const executeFetch = async (): Promise<any> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchConfig,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      attempts++;
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn(`Request to ${endpoint} timed out`);
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

/**
 * Función para obtener todos los datos del dashboard de forma paralela
 */
export const fetchData = async (): Promise<DashboardData> => {
  try {
    console.log('Fetching all dashboard data...');
    
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
    return {
      totalVolume: totalVolume.status === 'fulfilled' ? totalVolume.value : { hourly: {}, daily: {}, total: {} },
      volumeByLane: volumeByLane.status === 'fulfilled' ? volumeByLane.value : {},
      hourlyPatterns: hourlyPatterns.status === 'fulfilled' ? hourlyPatterns.value : {},
      avgSpeedByLane: avgSpeedByLane.status === 'fulfilled' ? avgSpeedByLane.value : {},
      bottlenecks: bottlenecks.status === 'fulfilled' ? bottlenecks.value : [],
      trafficEvolution: trafficEvolution.status === 'fulfilled' ? trafficEvolution.value : { timestamps: [], car: [], bus: [], truck: [] },
      speedEvolution: speedEvolution.status === 'fulfilled' ? speedEvolution.value : { timestamps: [], lane_1: [], lane_2: [], lane_3: [] },
      vehicleTypeDominance: vehicleTypeDominance.status === 'fulfilled' ? vehicleTypeDominance.value : {}
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Devuelve datos vacíos como respaldo
    return {
      totalVolume: { hourly: {}, daily: {}, total: {} },
      volumeByLane: {},
      hourlyPatterns: {},
      avgSpeedByLane: {},
      bottlenecks: [],
      trafficEvolution: { timestamps: [], car: [], bus: [], truck: [] },
      speedEvolution: { timestamps: [], lane_1: [], lane_2: [], lane_3: [] },
      vehicleTypeDominance: {}
    };
  }
};

// Funciones individuales para endpoints específicos
export const fetchTotalVehicleVolume = async (): Promise<TotalVolumeData> => {
  return fetchWithRetry('/detections/volume/total') || { hourly: {}, daily: {}, total: {} };
};

export const fetchVehicleVolumeByLane = async (): Promise<LaneVehicleData> => {
  return fetchWithRetry('/detections/volume/by-lane') || {};
};

export const fetchHourlyPatterns = async (): Promise<HourlyPatternsData> => {
  return fetchWithRetry('/detections/patterns/hourly') || {};
};

export const fetchAvgSpeedByLane = async (): Promise<SpeedByLaneData> => {
  return fetchWithRetry('/detections/lanes/speed') || {};
};

export const fetchBottlenecks = async (): Promise<BottleneckItem[]> => {
  return fetchWithRetry('/detections/lanes/bottlenecks') || [];
};

export const fetchTrafficEvolution = async (): Promise<TrafficEvolutionData> => {
  return fetchWithRetry('/detections/temporal/evolution') || { timestamps: [], car: [], bus: [], truck: [] };
};

export const fetchSpeedEvolution = async (): Promise<SpeedEvolutionData> => {
  return fetchWithRetry('/detections/temporal/speed') || { timestamps: [], lane_1: [], lane_2: [], lane_3: [] };
};

export const fetchVehicleTypeDominance = async (): Promise<VehicleTypeDominanceData> => {
  return fetchWithRetry('/detections/vehicle-types/dominance') || {};
};

// 5. Estructuras de datos
export const fetchArrayData = async (): Promise<number[]> => {
  return fetchWithRetry('/detections/structures/array') || [];
};

export const fetchLinkedListData = async () => {
  return fetchWithRetry('/detections/structures/linked-list') || [];
};

export const fetchDoubleLinkedListData = async () => {
  return fetchWithRetry('/detections/structures/double-linked-list') || [];
};

export const fetchCircularDoubleLinkedListData = async () => {
  return fetchWithRetry('/detections/structures/circular-double-linked-list') || [];
};

export const fetchStackData = async () => {
  return fetchWithRetry('/detections/structures/stack') || [];
};

export const fetchQueueData = async () => {
  return fetchWithRetry('/detections/structures/queue') || [];
};

export const fetchTreeData = async () => {
  return fetchWithRetry('/detections/structures/tree') || { value: 'Root', children: [] };
};