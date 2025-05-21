
const API_BASE_URL = 'http://localhost:8080/api';
const TIMEOUT_MS = 30000; // 30 segundos para permitir más tiempo en conexiones lentas
const RETRY_ATTEMPTS = 3; // Intentos de reconexión
const RETRY_DELAY_MS = 2000; // Tiempo entre reintentos

// Cache del lado del cliente
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

class ClientCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultExpiry = 5 * 60 * 1000; // 5 minutos por defecto
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.expiryTime) {
      // Entrada expirada
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, expiry: number = this.defaultExpiry): void {
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      expiryTime: timestamp + expiry
    });
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Devuelve una entrada fresca o vencida (para mostrar algo mientras se actualiza)
  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? entry.data as T : null;
  }
}

// Instancia única de caché para toda la aplicación
const clientCache = new ClientCache();

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
 * Función para realizar fetch con timeout y reintentos
 */
const fetchWithRetry = async <T>(
  url: string, 
  options = {}, 
  retries = RETRY_ATTEMPTS, 
  timeout = TIMEOUT_MS
): Promise<T> => {
  // Variable para seguimiento de errores
  let lastError: Error | null = null;
  
  // Intentar múltiples veces
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Si no es el primer intento, esperar antes de reintentar
      if (attempt > 0) {
        console.log(`🔄 Reintento ${attempt + 1}/${retries} para ${url} (esperando ${RETRY_DELAY_MS}ms)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
      
      // Crear una promesa de timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Tiempo de espera agotado (${timeout}ms) para: ${url}`));
        }, timeout);
      });
      
      // Realizar la petición real
      const fetchPromise = fetch(url, options);
      
      // Competir entre fetch y timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      // Parsear la respuesta como JSON
      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`⚠️ Error en intento ${attempt + 1}/${retries}: ${lastError.message}`);
      
      // Si es el último intento, propagar el error
      if (attempt === retries - 1) {
        throw lastError;
      }
    }
  }
  
  // Este punto nunca debería alcanzarse debido a la gestión de errores anterior
  throw new Error('Error inesperado en fetchWithRetry');
};

/**
 * Función genérica para obtener datos de la API con caché
 */
const fetchApiData = async <T>(endpoint: string, forceRefresh = false): Promise<T> => {
  const cacheKey = `api_${endpoint}`;
  
  // Si no se fuerza la actualización, verificar la caché primero
  if (!forceRefresh) {
    const cachedData = clientCache.get<T>(cacheKey);
    if (cachedData) {
      console.log(`📋 Usando datos en caché para: ${endpoint}`);
      return cachedData;
    }
  }
  
  try {
    console.log(`🔄 Solicitando datos desde API: ${endpoint}`);
    const data = await fetchWithRetry<T>(
      `${API_BASE_URL}${endpoint}`, 
      fetchConfig
    );
    
    // Guardar en caché
    clientCache.set<T>(cacheKey, data);
    console.log(`✅ Datos recibidos y almacenados en caché: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`❌ Error al obtener datos de ${endpoint}:`, error);
    
    // Intentar devolver datos obsoletos si están disponibles
    const staleData = clientCache.getStale<T>(cacheKey);
    if (staleData) {
      console.warn(`⚠️ Usando datos vencidos de caché para: ${endpoint}`);
      return staleData;
    }
    
    // Si no hay datos en caché, lanzar el error
    throw error;
  }
};

/**
 * Función para verificar la conexión con el backend
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log(`Verificando conexión a ${API_BASE_URL}/detections/volume/total`);
    
    // No usar caché para esta verificación
    await fetchWithRetry<any>(
      `${API_BASE_URL}/detections/volume/total`, 
      fetchConfig, 
      1, // Solo un intento
      30000 // 30 segundos de timeout para prueba rápida
    );
    
    console.log('✅ Conexión exitosa al backend');
    return true;
  } catch (error) {
    console.error('❌ Error en conexión al backend:', error);
    return false;
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
 * Función para obtener todos los datos del dashboard de manera optimizada
 * Usa una estrategia de carga paralela para reducir el tiempo total
 */
export const fetchData = async (forceRefresh = false): Promise<DashboardData> => {
  console.log('🔄 Iniciando carga optimizada de datos para el dashboard...');
  const startTime = performance.now();
  
  // Clave única para todos los datos del dashboard
  const DASHBOARD_CACHE_KEY = 'api_dashboard_all';
  
  // Si no forzamos actualización y tenemos datos en caché, usarlos
  if (!forceRefresh) {
    const cachedDashboard = clientCache.get<DashboardData>(DASHBOARD_CACHE_KEY);
    if (cachedDashboard) {
      console.log('📋 Usando datos completos del dashboard desde caché local');
      return cachedDashboard;
    }
  }
  
  try {
    // Verificar la conexión primero
    const connectionOk = await testBackendConnection();
    
    if (!connectionOk) {
      console.warn('⚠️ Sin conexión al backend. Usando datos de respaldo');
      // Verificar si hay datos vencidos en caché
      const staleDashboard = clientCache.getStale<DashboardData>(DASHBOARD_CACHE_KEY);
      if (staleDashboard) {
        console.warn('⚠️ Usando datos vencidos de la caché');
        return staleDashboard;
      }
      return getBackupData();
    }
    
    // Cargar todos los endpoints en paralelo para mejorar el rendimiento
    const results = await Promise.allSettled([
      fetchApiData<TotalVolumeData>('/detections/volume/total', forceRefresh),
      fetchApiData<LaneVehicleData>('/detections/volume/by-lane', forceRefresh),
      fetchApiData<HourlyPatternsData>('/detections/patterns/hourly', forceRefresh),
      fetchApiData<SpeedByLaneData>('/detections/lanes/speed', forceRefresh),
      fetchApiData<BottleneckItem[]>('/detections/lanes/bottlenecks', forceRefresh),
      fetchApiData<TrafficEvolutionData>('/detections/temporal/evolution', forceRefresh),
      fetchApiData<SpeedEvolutionData>('/detections/temporal/speed', forceRefresh),
      fetchApiData<VehicleTypeDominanceData>('/detections/vehicle-types/dominance', forceRefresh)
    ]);
    
    // Función auxiliar para obtener el valor o un respaldo
    const getValue = <T>(result: PromiseSettledResult<T>, fallback: T): T => {
      return result.status === 'fulfilled' ? result.value : fallback;
    };
    
    const backupData = getBackupData();
    
    // Construir el objeto con resultados exitosos o respaldos
    const dashboardData: DashboardData = {
      totalVolume: getValue(results[0] as PromiseSettledResult<TotalVolumeData>, backupData.totalVolume),
      volumeByLane: getValue(results[1] as PromiseSettledResult<LaneVehicleData>, backupData.volumeByLane),
      hourlyPatterns: getValue(results[2] as PromiseSettledResult<HourlyPatternsData>, backupData.hourlyPatterns),
      avgSpeedByLane: getValue(results[3] as PromiseSettledResult<SpeedByLaneData>, backupData.avgSpeedByLane),
      bottlenecks: getValue(results[4] as PromiseSettledResult<BottleneckItem[]>, backupData.bottlenecks),
      trafficEvolution: getValue(results[5] as PromiseSettledResult<TrafficEvolutionData>, backupData.trafficEvolution),
      speedEvolution: getValue(results[6] as PromiseSettledResult<SpeedEvolutionData>, backupData.speedEvolution),
      vehicleTypeDominance: getValue(results[7] as PromiseSettledResult<VehicleTypeDominanceData>, backupData.vehicleTypeDominance)
    };
    
    // Contar cuántos endpoints tuvieron éxito
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    console.log(`✅ ${successCount} de 8 endpoints respondieron correctamente`);
    
    // Guardar en caché completa para el dashboard
    clientCache.set(DASHBOARD_CACHE_KEY, dashboardData);
    
    const endTime = performance.now();
    console.log(`⏱️ Tiempo total de carga de datos: ${Math.round(endTime - startTime)}ms`);
    
    return dashboardData;
  } catch (error) {
    console.error('❌ Error general en fetchData:', error);
    
    // Intentar usar datos vencidos de la caché si existen
    const staleDashboard = clientCache.getStale<DashboardData>(DASHBOARD_CACHE_KEY);
    if (staleDashboard) {
      console.warn('⚠️ Error en fetchData, usando datos vencidos de la caché');
      return staleDashboard;
    }
    
    return getBackupData();
  }
};

// Funciones individuales para cada endpoint - usan el sistema de caché
export const fetchTotalVehicleVolume = async (forceRefresh = false): Promise<TotalVolumeData> => {
  try {
    return await fetchApiData<TotalVolumeData>('/detections/volume/total', forceRefresh);
  } catch (error) {
    console.error('Error en fetchTotalVehicleVolume:', error);
    return getBackupData().totalVolume;
  }
};

export const fetchVehicleVolumeByLane = async (forceRefresh = false): Promise<LaneVehicleData> => {
  try {
    return await fetchApiData<LaneVehicleData>('/detections/volume/by-lane', forceRefresh);
  } catch (error) {
    console.error('Error en fetchVehicleVolumeByLane:', error);
    return getBackupData().volumeByLane;
  }
};

export const fetchHourlyPatterns = async (forceRefresh = false): Promise<HourlyPatternsData> => {
  try {
    return await fetchApiData<HourlyPatternsData>('/detections/patterns/hourly', forceRefresh);
  } catch (error) {
    console.error('Error en fetchHourlyPatterns:', error);
    return getBackupData().hourlyPatterns;
  }
};

export const fetchAvgSpeedByLane = async (forceRefresh = false): Promise<SpeedByLaneData> => {
  try {
    return await fetchApiData<SpeedByLaneData>('/detections/lanes/speed', forceRefresh);
  } catch (error) {
    console.error('Error en fetchAvgSpeedByLane:', error);
    return getBackupData().avgSpeedByLane;
  }
};

export const fetchBottlenecks = async (forceRefresh = false): Promise<BottleneckItem[]> => {
  try {
    return await fetchApiData<BottleneckItem[]>('/detections/lanes/bottlenecks', forceRefresh);
  } catch (error) {
    console.error('Error en fetchBottlenecks:', error);
    return getBackupData().bottlenecks;
  }
};

export const fetchTrafficEvolution = async (forceRefresh = false): Promise<TrafficEvolutionData> => {
  try {
    return await fetchApiData<TrafficEvolutionData>('/detections/temporal/evolution', forceRefresh);
  } catch (error) {
    console.error('Error en fetchTrafficEvolution:', error);
    return getBackupData().trafficEvolution;
  }
};

export const fetchSpeedEvolution = async (forceRefresh = false): Promise<SpeedEvolutionData> => {
  try {
    return await fetchApiData<SpeedEvolutionData>('/detections/temporal/speed', forceRefresh);
  } catch (error) {
    console.error('Error en fetchSpeedEvolution:', error);
    return getBackupData().speedEvolution;
  }
};

export const fetchVehicleTypeDominance = async (forceRefresh = false): Promise<VehicleTypeDominanceData> => {
  try {
    return await fetchApiData<VehicleTypeDominanceData>('/detections/vehicle-types/dominance', forceRefresh);
  } catch (error) {
    console.error('Error en fetchVehicleTypeDominance:', error);
    return getBackupData().vehicleTypeDominance;
  }
};

// Funciones para estructuras de datos
export const fetchArrayData = async (forceRefresh = false): Promise<number[]> => {
  try {
    return await fetchApiData<number[]>('/detections/structures/array', forceRefresh);
  } catch (error) {
    console.error('Error en fetchArrayData:', error);
    return [45, 23, 78, 12, 90, 32, 56, 67];
  }
};

export const fetchLinkedListData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any[]>('/detections/structures/linked-list', forceRefresh);
  } catch (error) {
    console.error('Error en fetchLinkedListData:', error);
    return generateMockListData(8);
  }
};

export const fetchDoubleLinkedListData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any[]>('/detections/structures/double-linked-list', forceRefresh);
  } catch (error) {
    console.error('Error en fetchDoubleLinkedListData:', error);
    return generateMockListData(8);
  }
};

export const fetchCircularDoubleLinkedListData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any[]>('/detections/structures/circular-double-linked-list', forceRefresh);
  } catch (error) {
    console.error('Error en fetchCircularDoubleLinkedListData:', error);
    return generateMockListData(8);
  }
};

export const fetchStackData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any[]>('/detections/structures/stack', forceRefresh);
  } catch (error) {
    console.error('Error en fetchStackData:', error);
    return generateMockListData(8);
  }
};

export const fetchQueueData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any[]>('/detections/structures/queue', forceRefresh);
  } catch (error) {
    console.error('Error en fetchQueueData:', error);
    return generateMockListData(8);
  }
};

export const fetchTreeData = async (forceRefresh = false) => {
  try {
    return await fetchApiData<any>('/detections/structures/tree', forceRefresh);
  } catch (error) {
    console.error('Error en fetchTreeData:', error);
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

// Exportar la instancia de caché para poder manipularla desde otros componentes
export const cache = {
  clear: () => clientCache.clear(),
  invalidate: (key: string) => clientCache.invalidate(`api_${key}`)
};