// src/lib/api.ts
// Configuración base para fetch
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

// 1. Análisis de tráfico general
export const fetchTotalVehicleVolume = async () => {
  try {
    const response = await fetch('/api/detections/volume/total', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchVehicleVolumeByLane = async () => {
  try {
    const response = await fetch('/api/detections/volume/by-lane', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchHourlyPatterns = async () => {
  try {
    const response = await fetch('/api/detections/patterns/hourly', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

// 2. Análisis de comportamiento por carril
export const fetchAvgSpeedByLane = async () => {
  try {
    const response = await fetch('/api/detections/lanes/speed', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchBottlenecks = async () => {
  try {
    const response = await fetch('/api/detections/lanes/bottlenecks', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

// 3. Análisis temporal
export const fetchTrafficEvolution = async () => {
  try {
    const response = await fetch('/api/detections/temporal/evolution', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchSpeedEvolution = async () => {
  try {
    const response = await fetch('/api/detections/temporal/speed', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

// 4. Análisis por tipo de vehículo
export const fetchVehicleTypeDominance = async () => {
  try {
    const response = await fetch('/api/detections/vehicle-types/dominance', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

// 5. Estructuras de datos
export const fetchArrayData = async () => {
  try {
    const response = await fetch('/api/detections/structures/array', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchLinkedListData = async () => {
  try {
    const response = await fetch('/api/detections/structures/linked-list', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchDoubleLinkedListData = async () => {
  try {
    const response = await fetch('/api/detections/structures/double-linked-list', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchCircularDoubleLinkedListData = async () => {
  try {
    const response = await fetch('/api/detections/structures/circular-double-linked-list', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchStackData = async () => {
  try {
    const response = await fetch('/api/detections/structures/stack', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchQueueData = async () => {
  try {
    const response = await fetch('/api/detections/structures/queue', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};

export const fetchTreeData = async () => {
  try {
    const response = await fetch('/api/detections/structures/tree', fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error);
  }
};