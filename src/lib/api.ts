// src/lib/api.ts
// Configuración base para fetch
const API_BASE_URL = 'http://localhost:8080';

const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función para manejar errores en las peticiones
const handleFetchError = (error: unknown) => {
  console.error('Error en la petición:', error);
  throw error;
};

// Función genérica para fetching
const fetchData = async (endpoint: string) => {
  try {
    console.log(`Fetching data from: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

// 1. Análisis de tráfico general
export const fetchTotalVehicleVolume = async () => {
  return fetchData('/api/detections/volume/total');
};

export const fetchVehicleVolumeByLane = async () => {
  return fetchData('/api/detections/volume/by-lane');
};

export const fetchHourlyPatterns = async () => {
  return fetchData('/api/detections/patterns/hourly');
};

// 2. Análisis de comportamiento por carril
export const fetchAvgSpeedByLane = async () => {
  return fetchData('/api/detections/lanes/speed');
};

export const fetchBottlenecks = async () => {
  return fetchData('/api/detections/lanes/bottlenecks');
};

// 3. Análisis temporal
export const fetchTrafficEvolution = async () => {
  return fetchData('/api/detections/temporal/evolution');
};

export const fetchSpeedEvolution = async () => {
  return fetchData('/api/detections/temporal/speed');
};

// 4. Análisis por tipo de vehículo
export const fetchVehicleTypeDominance = async () => {
  return fetchData('/api/detections/vehicle-types/dominance');
};

// 5. Estructuras de datos
export const fetchArrayData = async () => {
  return fetchData('/api/detections/structures/array');
};

export const fetchLinkedListData = async () => {
  return fetchData('/api/detections/structures/linked-list');
};

export const fetchDoubleLinkedListData = async () => {
  return fetchData('/api/detections/structures/double-linked-list');
};

export const fetchCircularDoubleLinkedListData = async () => {
  return fetchData('/api/detections/structures/circular-double-linked-list');
};

export const fetchStackData = async () => {
  return fetchData('/api/detections/structures/stack');
};

export const fetchQueueData = async () => {
  return fetchData('/api/detections/structures/queue');
};

export const fetchTreeData = async () => {
  return fetchData('/api/detections/structures/tree');
};