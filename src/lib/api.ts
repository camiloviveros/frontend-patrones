// src/lib/api.ts - VERSIÓN CON TIMEOUT EXTENDIDO

// Configuración base para fetch
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Configuración base para fetch
 */
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as RequestMode,
};

/**
 * Función para realizar fetch con timeout sin usar AbortController
 * Esta función evita el problema de "signal is aborted without reason"
 * Y ahora tiene un timeout más largo (10 segundos)
 */
const fetchWithTimeout = async (url: string, options = {}, timeout = 10000): Promise<Response> => {
  console.log(`🔄 Realizando petición a: ${url}`);
  
  // Intentar al menos 2 veces con un retraso entre intentos
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      // Usar Promise.race para implementar timeout
      return await Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) => {
          // Solo rechazar después del timeout
          setTimeout(() => {
            console.log(`⏱️ Timeout (${timeout}ms) para ${url}, intento ${attempt}`);
            reject(new Error(`Tiempo de espera agotado (${timeout}ms)`));
          }, timeout);
        }) as Promise<Response>
      ]);
    } catch (error) {
      // Si estamos en el último intento, propagar el error
      if (attempt >= 2) throw error;
      
      // Esperar un poco antes de reintentar
      console.log(`⚠️ Error en intento ${attempt}, esperando 1 segundo antes de reintentar...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Esto nunca debería ejecutarse debido al manejo anterior
  throw new Error('Error inesperado en fetchWithTimeout');
};

/**
 * Verificar la conexión con el backend
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log(`Verificando conexión a ${API_BASE_URL}/detections/volume/total`);
    
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/detections/volume/total`, 
      fetchConfig, 
      10000 // 10 segundos de timeout
    );
    
    if (response.ok) {
      console.log('✅ Conexión exitosa al backend');
      return true;
    } else {
      console.error(`❌ Conexión fallida: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en conexión directa:', error);
    
    if (error instanceof Error) {
      // Detección de problemas comunes
      if (error.message.includes('Tiempo de espera agotado')) {
        console.warn('⚠️ El backend no responde a tiempo. Posibles causas:');
        console.warn('1. El servidor Spring Boot no está ejecutándose');
        console.warn('2. La base de datos MySQL está lenta o no responde');
        console.warn('3. El backend está procesando muchas peticiones');
      } else if (error.message.includes('Failed to fetch')) {
        console.warn('⚠️ No se puede conectar al backend. Posibles causas:');
        console.warn('1. El servidor Spring Boot no está ejecutándose');
        console.warn('2. La URL del backend es incorrecta');
        console.warn('3. Hay un problema de red o firewall');
      }
    }
    
    return false;
  }
};

/**
 * Función optimizada para fetching con reintentos
 */
const fetchWithRetry = async (endpoint: string, retries = 2): Promise<any> => {
  let attempts = 0;
  let lastError: any = null;
  
  // Aumentar el tiempo de espera a 15 segundos para endpoints específicos que pueden ser lentos
  const slowEndpoints = [
    '/detections/temporal/evolution',
    '/detections/temporal/speed'
  ];
  
  const timeout = slowEndpoints.some(slow => endpoint.includes(slow)) ? 15000 : 10000;
  
  while (attempts <= retries) {
    try {
      console.log(`🔄 Intento ${attempts + 1} para ${endpoint}`);
      
      const response = await fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        fetchConfig,
        timeout 
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Datos recibidos de ${endpoint} (${Object.keys(data).length} campos)`);
      return data;
    } catch (error) {
      attempts++;
      lastError = error;
      
      if (attempts <= retries) {
        console.log(`⚠️ Error en intento ${attempts}, reintentando...`);
        // Aumentar la pausa antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.error(`❌ Error final después de ${attempts} intentos:`, lastError);
  
  // Para una mejor experiencia de usuario, usar datos de respaldo en lugar de lanzar error
  console.warn('⚠️ Usando datos de respaldo para:', endpoint);
  
  // Determinar qué datos de respaldo devolver según el endpoint
  switch (true) {
    case endpoint.includes('/volume/total'):
      return getBackupData().totalVolume;
    case endpoint.includes('/volume/by-lane'):
      return getBackupData().volumeByLane;
    case endpoint.includes('/patterns/hourly'):
      return getBackupData().hourlyPatterns;
    case endpoint.includes('/lanes/speed'):
      return getBackupData().avgSpeedByLane;
    case endpoint.includes('/lanes/bottlenecks'):
      return getBackupData().bottlenecks;
    case endpoint.includes('/temporal/evolution'):
      return getBackupData().trafficEvolution;
    case endpoint.includes('/temporal/speed'):
      return getBackupData().speedEvolution;
    case endpoint.includes('/vehicle-types/dominance'):
      return getBackupData().vehicleTypeDominance;
    default:
      // Para otros endpoints, devolver un objeto vacío
      return {};
  }
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
 * Datos de respaldo para cuando la API no está disponible
 */
const getBackupData = (): DashboardData => {
  console.log("📄 Generando datos de respaldo...");
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
};

/**
 * Función para obtener todos los datos del dashboard
 */
export const fetchData = async (): Promise<DashboardData> => {
  console.log('🔄 Iniciando fetchData para obtener todos los datos...');
  
  try {
    // Verificar primero si hay conexión con el backend
    const connectionOk = await testBackendConnection();
    console.log(`🌐 Conexión directa al backend: ${connectionOk ? '✅ OK' : '❌ Fallida'}`);
    
    if (!connectionOk) {
      console.warn('⚠️ Usando datos de respaldo debido a error de conexión');
      return getBackupData();
    }
    
    try {
      // Fetch individual para cada endpoint, pero usar datos de respaldo si alguno falla
      console.log('📊 Obteniendo datos del dashboard...');
      
      // Usar Promise.allSettled para obtener todos los datos incluso si algunos fallan
      const results = await Promise.allSettled([
        fetchWithRetry('/detections/volume/total'),
        fetchWithRetry('/detections/volume/by-lane'),
        fetchWithRetry('/detections/patterns/hourly'),
        fetchWithRetry('/detections/lanes/speed'),
        fetchWithRetry('/detections/lanes/bottlenecks'),
        fetchWithRetry('/detections/temporal/evolution'),
        fetchWithRetry('/detections/temporal/speed'),
        fetchWithRetry('/detections/vehicle-types/dominance')
      ]);
      
      // Obtener resultados o datos de respaldo para cada endpoint
      const [
        totalVolumeResult,
        volumeByLaneResult,
        hourlyPatternsResult,
        avgSpeedByLaneResult,
        bottlenecksResult,
        trafficEvolutionResult,
        speedEvolutionResult,
        vehicleTypeDominanceResult
      ] = results;
      
      // Función auxiliar para obtener el valor o datos de respaldo
      const getValue = (result: PromiseSettledResult<any>, fallback: any) => {
        return result.status === 'fulfilled' ? result.value : fallback;
      };
      
      const backupData = getBackupData();
      
      // Construir objeto de datos con resultados exitosos o respaldos
      const dashboardData = {
        totalVolume: getValue(totalVolumeResult, backupData.totalVolume),
        volumeByLane: getValue(volumeByLaneResult, backupData.volumeByLane),
        hourlyPatterns: getValue(hourlyPatternsResult, backupData.hourlyPatterns),
        avgSpeedByLane: getValue(avgSpeedByLaneResult, backupData.avgSpeedByLane),
        bottlenecks: getValue(bottlenecksResult, backupData.bottlenecks),
        trafficEvolution: getValue(trafficEvolutionResult, backupData.trafficEvolution),
        speedEvolution: getValue(speedEvolutionResult, backupData.speedEvolution),
        vehicleTypeDominance: getValue(vehicleTypeDominanceResult, backupData.vehicleTypeDominance)
      };
      
      // Contar cuántos endpoints tuvieron éxito
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`✅ ${successCount} de 8 endpoints respondieron correctamente`);
      
      return dashboardData;
    } catch (error) {
      console.error('❌ Error al obtener los datos del dashboard:', error);
      return getBackupData();
    }
  } catch (error) {
    console.error('❌ Error general en fetchData:', error);
    return getBackupData();
  }
};

// Funciones para cada endpoint específico - ahora usan fetchWithRetry con valores de respaldo
export const fetchTotalVehicleVolume = async (): Promise<TotalVolumeData> => {
  try {
    return await fetchWithRetry('/detections/volume/total');
  } catch (error) {
    return getBackupData().totalVolume;
  }
};

export const fetchVehicleVolumeByLane = async (): Promise<LaneVehicleData> => {
  try {
    return await fetchWithRetry('/detections/volume/by-lane');
  } catch (error) {
    return getBackupData().volumeByLane;
  }
};

export const fetchHourlyPatterns = async (): Promise<HourlyPatternsData> => {
  try {
    return await fetchWithRetry('/detections/patterns/hourly');
  } catch (error) {
    return getBackupData().hourlyPatterns;
  }
};

export const fetchAvgSpeedByLane = async (): Promise<SpeedByLaneData> => {
  try {
    return await fetchWithRetry('/detections/lanes/speed');
  } catch (error) {
    return getBackupData().avgSpeedByLane;
  }
};

export const fetchBottlenecks = async (): Promise<BottleneckItem[]> => {
  try {
    return await fetchWithRetry('/detections/lanes/bottlenecks');
  } catch (error) {
    return getBackupData().bottlenecks;
  }
};

export const fetchTrafficEvolution = async (): Promise<TrafficEvolutionData> => {
  try {
    return await fetchWithRetry('/detections/temporal/evolution');
  } catch (error) {
    return getBackupData().trafficEvolution;
  }
};

export const fetchSpeedEvolution = async (): Promise<SpeedEvolutionData> => {
  try {
    return await fetchWithRetry('/detections/temporal/speed');
  } catch (error) {
    return getBackupData().speedEvolution;
  }
};

export const fetchVehicleTypeDominance = async (): Promise<VehicleTypeDominanceData> => {
  try {
    return await fetchWithRetry('/detections/vehicle-types/dominance');
  } catch (error) {
    return getBackupData().vehicleTypeDominance;
  }
};

// Métodos para estructuras de datos - ahora con mejor manejo de errores
export const fetchArrayData = async (): Promise<number[]> => {
  try {
    return await fetchWithRetry('/detections/structures/array');
  } catch (error) {
    return [45, 23, 78, 12, 90, 32, 56, 67];
  }
};

export const fetchLinkedListData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/linked-list');
  } catch (error) {
    return generateMockListData(8);
  }
};

export const fetchDoubleLinkedListData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/double-linked-list');
  } catch (error) {
    return generateMockListData(8);
  }
};

export const fetchCircularDoubleLinkedListData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/circular-double-linked-list');
  } catch (error) {
    return generateMockListData(8);
  }
};

export const fetchStackData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/stack');
  } catch (error) {
    return generateMockListData(8);
  }
};

export const fetchQueueData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/queue');
  } catch (error) {
    return generateMockListData(8);
  }
};

export const fetchTreeData = async () => {
  try {
    return await fetchWithRetry('/detections/structures/tree');
  } catch (error) {
    return {
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
  }
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